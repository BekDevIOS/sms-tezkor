import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Contact, Contacts } from '../../libs/dto/contact/contact';
import { ContactsInquiry, CreateContactDto, ImportContactsDto, UpdateContactDto } from '../../libs/dto/contact/contact.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { ContactService } from './contact.service';

@Controller('contact')
@UseGuards(MemberAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@AuthMember('_id') memberId: string, @Body() input: CreateContactDto): Promise<Contact> {
    return this.contactService.create(memberId, input);
  }

  @Post('import')
  import(@AuthMember('_id') memberId: string, @Body() input: ImportContactsDto) {
    return this.contactService.import(memberId, input);
  }

  @Get()
  getContacts(@AuthMember('_id') memberId: string, @Query() inquiry: ContactsInquiry): Promise<Contacts> {
    return this.contactService.getContacts(memberId, inquiry);
  }

  @Get('/:id')
  getContact(@AuthMember('_id') memberId: string, @Param('id') id: string): Promise<Contact> {
    return this.contactService.getContact(memberId, id);
  }

  @Post('/:id')
  update(
    @AuthMember('_id') memberId: string,
    @Param('id') id: string,
    @Body() input: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactService.update(memberId, id, input);
  }

  @Post('/:id/delete')
  @HttpCode(200)
  remove(@AuthMember('_id') memberId: string, @Param('id') id: string) {
    return this.contactService.remove(memberId, id);
  }
}
