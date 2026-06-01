import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ContactSchema from '../../schemas/Contact.model';
import MemberSchema from '../../schemas/Member.model';
import ContactGroupSchema from '../../schemas/Contact-group.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.CONTACT, schema: ContactSchema },
      { name: MODEL.MEMBER, schema: MemberSchema },
      { name: MODEL.CONTACT_GROUP, schema: ContactGroupSchema },
    ]),
    AuthModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
