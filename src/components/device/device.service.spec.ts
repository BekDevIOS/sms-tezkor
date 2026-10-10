import { HttpStatus } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceStatus } from '../../libs/enums/device.enum';

describe('DeviceService MVP sender limit', () => {
  const memberId = '507f1f77bcf86cd799439011';

  function setup(count: number) {
    const deviceModel = {
      countDocuments: jest.fn().mockResolvedValue(count),
      create: jest.fn().mockResolvedValue({
        _id: '507f191e810c19729de860ea',
        code: 'ABCD2345',
        name: 'Android telefon',
        status: DeviceStatus.OFFLINE,
      }),
    };
    const memberModel = { updateOne: jest.fn().mockResolvedValue({}) };
    const subscriptionService = {
      getActiveForMember: jest.fn().mockResolvedValue({ plan: 'PRO', deviceLimit: 99 }),
    };
    const service = new DeviceService(
      deviceModel as any,
      memberModel as any,
      {} as any,
      subscriptionService as any,
      {} as any,
    );
    return { service, deviceModel, memberModel };
  }

  it('rejects a second device even when a subscription has a larger legacy limit', async () => {
    const { service, deviceModel } = setup(1);

    await expect(
      service.createDevice(memberId, { name: 'Ikkinchi telefon' } as any),
    ).rejects.toMatchObject({ statusCode: HttpStatus.CONFLICT });
    expect(deviceModel.create).not.toHaveBeenCalled();
  });

  it('creates the first sender and applies plan throughput', async () => {
    const { service, deviceModel, memberModel } = setup(0);

    const result = await service.createDevice(memberId, { name: 'Android telefon' } as any);

    expect(result).toMatchObject({ name: 'Android telefon', status: DeviceStatus.OFFLINE });
    expect(deviceModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Android telefon', sendLimitPerMinute: 120 }),
    );
    expect(memberModel.updateOne).toHaveBeenCalled();
  });
});
