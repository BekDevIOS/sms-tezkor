import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Campaign, CampaignDetail, Campaigns } from '../../libs/dto/campaign/campaign';
import { CampaignsInquiry, CreateCampaignDto } from '../../libs/dto/campaign/campaign.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { SubscriptionGuard } from '../subscription/subscription.guard';
import { CampaignService } from './campaign.service';

@Controller('campaign')
@UseGuards(MemberAuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  // Creating/sending a campaign requires an active subscription.
  @Post()
  @UseGuards(SubscriptionGuard)
  create(@AuthMember('_id') memberId: string, @Body() input: CreateCampaignDto): Promise<Campaign | CampaignDetail> {
    return this.campaignService.create(memberId, input);
  }

  @Get()
  getCampaigns(@AuthMember('_id') memberId: string, @Query() inquiry: CampaignsInquiry): Promise<Campaigns> {
    return this.campaignService.getCampaigns(memberId, inquiry);
  }

  @Get('/:id')
  getCampaign(@AuthMember('_id') memberId: string, @Param('id') id: string): Promise<CampaignDetail> {
    return this.campaignService.getCampaign(memberId, id);
  }

  @Post('/:id/cancel')
  @HttpCode(200)
  cancel(@AuthMember('_id') memberId: string, @Param('id') id: string): Promise<CampaignDetail> {
    return this.campaignService.cancel(memberId, id);
  }
}
