import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ContactGroupSchema from '../../schemas/Contact-group.model';
import ContactSchema from '../../schemas/Contact.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { ContactGroupController } from './contact-group.controller';
import { ContactGroupService } from './contact-group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.CONTACT_GROUP, schema: ContactGroupSchema },
      { name: MODEL.CONTACT, schema: ContactSchema },
    ]),
    AuthModule,
  ],
  controllers: [ContactGroupController],
  providers: [ContactGroupService],
})
export class ContactGroupModule {}
