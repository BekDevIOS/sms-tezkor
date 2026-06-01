import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ContactGroup } from '../../libs/dto/contact-group/contact-group';
import { CreateContactGroupDto, UpdateContactGroupDto } from '../../libs/dto/contact-group/contact-group.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { ContactGroupService } from './contact-group.service';

@Controller('contact-group')
@UseGuards(MemberAuthGuard)
export class ContactGroupController {
  constructor(private readonly contactGroupService: ContactGroupService) {}

  @Get()
  list(@AuthMember('_id') memberId: string): Promise<ContactGroup[]> {
    return this.contactGroupService.list(memberId);
  }

  @Post()
  create(@AuthMember('_id') memberId: string, @Body() input: CreateContactGroupDto): Promise<ContactGroup> {
    return this.contactGroupService.create(memberId, input);
  }

  @Post(':id')
  update(
    @AuthMember('_id') memberId: string,
    @Param('id') id: string,
    @Body() input: UpdateContactGroupDto,
  ): Promise<ContactGroup> {
    return this.contactGroupService.update(memberId, id, input);
  }

  @Post(':id/delete')
  @HttpCode(200)
  remove(@AuthMember('_id') memberId: string, @Param('id') id: string) {
    return this.contactGroupService.remove(memberId, id);
  }
}
