import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Device, DeviceClaimResult, DeviceCreated, DeviceJob, Devices } from '../../libs/dto/device/device';
import {
  CreateDeviceDto,
  DeviceClaimInput,
  HeartbeatInput,
  ReportResultInput,
} from '../../libs/dto/device/device.input';
import { AuthDevice } from '../auth/decorators/authDevice.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { DeviceAuthGuard } from '../auth/guards/device-auth.guard';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  // ----- Member-facing (manage devices) -----

  @Post()
  @UseGuards(MemberAuthGuard)
  create(@AuthMember('_id') memberId: string, @Body() input: CreateDeviceDto): Promise<DeviceCreated> {
    return this.deviceService.createDevice(memberId, input);
  }

  @Get()
  @UseGuards(MemberAuthGuard)
  getDevices(@AuthMember('_id') memberId: string): Promise<Devices> {
    return this.deviceService.getDevices(memberId);
  }

  @Post(':id/reset-code')
  @HttpCode(200)
  @UseGuards(MemberAuthGuard)
  resetCode(@AuthMember('_id') memberId: string, @Param('id') id: string): Promise<DeviceCreated> {
    return this.deviceService.resetCode(memberId, id);
  }

  @Post(':id/revoke')
  @HttpCode(200)
  @UseGuards(MemberAuthGuard)
  revoke(@AuthMember('_id') memberId: string, @Param('id') id: string) {
    return this.deviceService.revoke(memberId, id);
  }

  // ----- Device-facing -----

  /** Public: a phone exchanges its pairing code for a device session token. */
  // Tight limit guards against pairing-code brute force.
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('claim')
  @HttpCode(200)
  claim(@Body() input: DeviceClaimInput): Promise<DeviceClaimResult> {
    return this.deviceService.claim(input.code);
  }

  // High-frequency device polling endpoints: never throttle, or dispatch breaks.
  @SkipThrottle()
  @Post('heartbeat')
  @HttpCode(200)
  @UseGuards(DeviceAuthGuard)
  heartbeat(@AuthDevice('_id') deviceId: string, @Body() input: HeartbeatInput): Promise<Device> {
    return this.deviceService.heartbeat(deviceId, input);
  }

  @SkipThrottle()
  @Get('jobs')
  @UseGuards(DeviceAuthGuard)
  jobs(@AuthDevice('_id') deviceId: string, @Query('limit') limit?: string): Promise<DeviceJob[]> {
    return this.deviceService.getJobs(deviceId, limit ? Number(limit) : undefined);
  }

  @SkipThrottle()
  @Post('report')
  @HttpCode(200)
  @UseGuards(DeviceAuthGuard)
  report(@AuthDevice('_id') deviceId: string, @Body() input: ReportResultInput): Promise<{ success: boolean }> {
    return this.deviceService.report(deviceId, input);
  }
}
