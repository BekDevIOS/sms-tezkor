import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL } from '../../libs/types/model-names';
import TemplateSchema from '../../schemas/Template.model';
import { AuthModule } from '../auth/auth.module';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MODEL.TEMPLATE, schema: TemplateSchema }]),
    AuthModule,
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
