export const DeviceStatus = {
	OFFLINE: 'OFFLINE',
	ONLINE: 'ONLINE',
	BUSY: 'BUSY',
	ERROR: 'ERROR',
} as const;

export type DeviceStatusValue =
	(typeof DeviceStatus)[keyof typeof DeviceStatus];

export const DEVICE_STATUS_VALUES: DeviceStatusValue[] =
	Object.values(DeviceStatus);

export const DevicePlatform = {
	ANDROID: 'ANDROID',
} as const;

export type DevicePlatformValue =
	(typeof DevicePlatform)[keyof typeof DevicePlatform];

export const DEVICE_PLATFORM_VALUES: DevicePlatformValue[] =
	Object.values(DevicePlatform);

export const DeviceNetworkType = {
	WIFI: 'WIFI',
	MOBILE: 'MOBILE',
	UNKNOWN: 'UNKNOWN',
} as const;

export type DeviceNetworkTypeValue =
	(typeof DeviceNetworkType)[keyof typeof DeviceNetworkType];

export const DEVICE_NETWORK_TYPE_VALUES: DeviceNetworkTypeValue[] =
	Object.values(DeviceNetworkType);
