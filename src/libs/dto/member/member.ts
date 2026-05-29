import { Exclude } from 'class-transformer';
import { MemberAuthType, MemberRole, MemberStatus } from '../../enums/member.enum';

export class Member {
  _id: string;
  memberStatus: MemberStatus;
  memberRole: MemberRole;
  memberAuthType: MemberAuthType;
  memberEmail: string;
  memberPhone?: string;
  memberFirstName: string;
  memberLastName?: string;
  memberCompanyName?: string;
  memberImage?: string;
  memberDevices: number;
  memberContacts: number;
  memberCampaigns: number;
  memberSentSms: number;
  memberFailedSms: number;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  memberPassword?: string;
}

export class AuthResponse {
  token: string;
  member: Member;
}
