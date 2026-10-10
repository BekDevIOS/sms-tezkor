import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { PLAN_LIMITS } from '../../libs/config';
import { Device, DeviceClaimResult, DeviceCreated, DeviceJob, Devices } from '../../libs/dto/device/device';
import { CreateDeviceDto, HeartbeatInput, ReportResultInput } from '../../libs/dto/device/device.input';
import { Message } from '../../libs/enums/common';
import { SubscriptionPlan } from '../../libs/enums/subscription.enum';
import { DeviceStatus } from '../../libs/enums/device.enum';
import { SessionOwnerType } from '../../libs/enums/session.enum';
import { MODEL } from '../../libs/types/model-names';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { DispatchService } from '../../dispatch/dispatch.service';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
const CODE_LENGTH = 8;

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(MODEL.DEVICE) private readonly deviceModel: Model<any>,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
    private readonly dispatchService: DispatchService,
  ) {}

  private generateCode(): string {
    const bytes = randomBytes(CODE_LENGTH);
    let out = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    }
    return out;
  }

  /** Member creates a device slot; returns the one-time pairing code. */
  async createDevice(memberId: string, input: CreateDeviceDto): Promise<DeviceCreated> {
    const memberObjectId = new Types.ObjectId(memberId);

    // Derive device cap + per-device throughput from the member's plan.
    // Explicit subscription.deviceLimit wins; otherwise fall back to the plan
    // tier. Device slots are part of a paid subscription.
    const subscription = await this.subscriptionService.getActiveForMember(memberId);
    if (!subscription) {
      throw new AppException(HttpStatus.FORBIDDEN, Message.SUBSCRIPTION_REQUIRED);
    }
    const planLimits = subscription?.plan
      ? PLAN_LIMITS[subscription.plan as SubscriptionPlan]
      : undefined;
    const limit =
      typeof subscription?.deviceLimit === 'number'
        ? subscription.deviceLimit
        : (planLimits?.deviceLimit ?? null);
    if (typeof limit === 'number') {
      const count = await this.deviceModel.countDocuments({ memberId: memberObjectId });
      if (count >= limit) {
        throw new AppException(HttpStatus.FORBIDDEN, Message.DEVICE_LIMIT_REACHED);
      }
    }

    let lastErr: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = this.generateCode();
      try {
        const device = await this.deviceModel.create({
          memberId: memberObjectId,
          code,
          name: input.name,
          platform: input.platform,
          phone: input.phone,
          status: DeviceStatus.OFFLINE,
          // Per-device throughput from the plan tier (schema default applies if absent).
          ...(planLimits ? { sendLimitPerMinute: planLimits.sendLimitPerMinute } : {}),
        });
        await this.memberModel.updateOne({ _id: memberObjectId }, { $inc: { memberDevices: 1 } });
        return {
          deviceId: String(device._id),
          code: device.code,
          name: device.name,
          status: device.status,
        };
      } catch (err: any) {
        lastErr = err;
        if (err?.code !== 11000) throw err; // not a duplicate-code collision
      }
    }
    throw lastErr;
  }

  /** Device pairs using its code; returns a DEVICE session token. */
  async claim(code: string): Promise<DeviceClaimResult> {
    const usedCode = `USED-${randomBytes(12).toString('hex')}`;
    const device = await this.deviceModel.findOneAndUpdate(
      { code: code.trim() },
      {
        $set: {
          code: usedCode,
          status: DeviceStatus.ONLINE,
          pairedAt: new Date(),
          lastSeenAt: new Date(),
        },
      },
      { new: true },
    );
    if (!device) {
      throw new AppException(HttpStatus.UNAUTHORIZED, Message.INVALID_DEVICE_CODE);
    }

    const token = await this.authService.createSession(device._id, SessionOwnerType.DEVICE);
    return {
      token,
      device: {
        deviceId: String(device._id),
        name: device.name,
        sendLimitPerMinute: device.sendLimitPerMinute,
      },
    };
  }

  async resetCode(memberId: string, id: string): Promise<DeviceCreated> {
    const code = this.generateCode();
    const owned = await this.deviceModel.exists({ _id: id, memberId: new Types.ObjectId(memberId) });
    if (!owned) throw new AppException(HttpStatus.NOT_FOUND, Message.DEVICE_NOT_FOUND);
    await this.dispatchService.stopDeviceJobs(id);
    const device = await this.deviceModel.findOneAndUpdate(
      { _id: id, memberId: new Types.ObjectId(memberId) },
      {
        $set: { code, status: DeviceStatus.OFFLINE, currentLoad: 0 },
        $unset: { pairedAt: 1, lastSeenAt: 1 },
      },
      { new: true },
    );
    if (!device) throw new AppException(HttpStatus.NOT_FOUND, Message.DEVICE_NOT_FOUND);
    await this.authService.revokeSessions(device._id, SessionOwnerType.DEVICE);
    return { deviceId: String(device._id), code: device.code, name: device.name, status: device.status };
  }

  async revoke(memberId: string, id: string): Promise<{ success: boolean }> {
    const owned = await this.deviceModel.exists({ _id: id, memberId: new Types.ObjectId(memberId) });
    if (!owned) throw new AppException(HttpStatus.NOT_FOUND, Message.DEVICE_NOT_FOUND);
    await this.dispatchService.stopDeviceJobs(id);
    const device = await this.deviceModel.findOneAndUpdate(
      { _id: id, memberId: new Types.ObjectId(memberId) },
      { $set: { status: DeviceStatus.BLOCKED, currentLoad: 0 } },
      { new: true },
    );
    if (!device) throw new AppException(HttpStatus.NOT_FOUND, Message.DEVICE_NOT_FOUND);
    await this.authService.revokeSessions(device._id, SessionOwnerType.DEVICE);
    return { success: true };
  }

  async heartbeat(deviceId: string, input: HeartbeatInput): Promise<Device> {
    const update: Record<string, unknown> = { lastSeenAt: new Date() };
    if (input.status !== undefined) update.status = input.status;
    if (input.batteryLevel !== undefined) update.batteryLevel = input.batteryLevel;
    if (input.networkType !== undefined) update.networkType = input.networkType;
    if (input.appVersion !== undefined) update.appVersion = input.appVersion;
    if (input.simSubscriptionId !== undefined) update.simSubscriptionId = input.simSubscriptionId;
    if (input.simSlotIndex !== undefined) update.simSlotIndex = input.simSlotIndex;
    if (input.simCarrier !== undefined) update.simCarrier = input.simCarrier;

    const device = await this.deviceModel.findByIdAndUpdate(deviceId, { $set: update }, { new: true }).lean();
    if (!device) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.DEVICE_NOT_FOUND);
    }
    return device as Device;
  }

  async getDevices(memberId: string): Promise<Devices> {
    const filter = { memberId: new Types.ObjectId(memberId) };
    const [list, total] = await Promise.all([
      this.deviceModel.find(filter).sort({ createdAt: -1 }).lean(),
      this.deviceModel.countDocuments(filter),
    ]);
    return { list: list as Device[], total };
  }

  getJobs(deviceId: string, limit?: number): Promise<DeviceJob[]> {
    return this.dispatchService.claimJobsForDevice(deviceId, limit);
  }

  report(deviceId: string, input: ReportResultInput): Promise<{ success: boolean }> {
    return this.dispatchService.reportResult(deviceId, input);
  }
}
