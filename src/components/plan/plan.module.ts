import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PlanSchema from '../../schemas/Plan.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { AdminPlanController } from './admin.controller';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MODEL.PLAN, schema: PlanSchema }]),
    AuthModule,
  ],
  controllers: [PlanController, AdminPlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
