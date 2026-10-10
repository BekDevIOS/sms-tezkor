import { DevicePlatform, DeviceStatus } from '../../enums/device.enum';

export class Device {
  _id: string;
  memberId: string;
  code: string;
  name: string;
  status: DeviceStatus;
  platform?: DevicePlatform;
  phone?: string;
  carrier?: string;
  simSubscriptionId?: number;
  simSlotIndex?: number;
  simCarrier?: string;
  networkType?: string;
  batteryLevel?: number;
  appVersion?: string;
  lastSeenAt?: Date;
  pairedAt?: Date;
  currentLoad: number;
  sendLimitPerMinute: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Devices {
  list: Device[];
  total: number;
}

/** Returned to a member after creating a device — includes the one-time code. */
export class DeviceCreated {
  deviceId: string;
  code: string;
  name: string;
  status: DeviceStatus;
}

/** Returned to a device after claiming its code. */
export class DeviceClaimResult {
  token: string;
  device: {
    deviceId: string;
    name: string;
    sendLimitPerMinute: number;
  };
}

/** One SMS job handed to a polling device. */
export class DeviceJob {
  recipientId: string;
  campaignId: string;
  phone: string;
  message: string;
}
