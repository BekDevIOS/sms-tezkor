import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '@app/shared/schemas/Member.model';
import SubscriptionSchema from '@app/shared/schemas/Subscription.model';
import { MODEL } from '@app/shared/libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { AdminSubscriptionController } from './admin.controller';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionGuard } from './subscription.guard';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.SUBSCRIPTION, schema: SubscriptionSchema },
      { name: MODEL.MEMBER, schema: MemberSchema },
    ]),
    AuthModule,
  ],
  controllers: [SubscriptionController, AdminSubscriptionController],
  providers: [SubscriptionService, SubscriptionGuard],
  exports: [SubscriptionService, SubscriptionGuard],
})
export class SubscriptionModule {}
