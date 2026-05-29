import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Model, Types } from 'mongoose';
import { AppException } from '@app/shared/common/app.exception';
import { AuthResponse, Member } from '@app/shared/libs/dto/member/member';
import { LoginInput, RegisterInput } from '@app/shared/libs/dto/member/member.input';
import { Message } from '@app/shared/libs/enums/common';
import { MemberStatus } from '@app/shared/libs/enums/member.enum';
import { SessionOwnerType } from '@app/shared/libs/enums/session.enum';
import { MODEL } from '@app/shared/libs/types/model-names';

const BCRYPT_COST = 10;
const MEMBER_SESSION_TTL_DAYS = 30;
const DEVICE_SESSION_TTL_DAYS = 365;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    @InjectModel(MODEL.SESSION) private readonly sessionModel: Model<any>,
  ) {}

  hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, BCRYPT_COST);
  }

  comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  /** Create an opaque session token for a member or device. */
  async createSession(
    ownerId: string | Types.ObjectId,
    type: SessionOwnerType,
    ttlDays = type === SessionOwnerType.DEVICE ? DEVICE_SESSION_TTL_DAYS : MEMBER_SESSION_TTL_DAYS,
  ): Promise<string> {
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    await this.sessionModel.create({ ownerId, type, token, expiresAt });
    return token;
  }

  /**
   * Resolve a bearer token to its owner document. Returns null when the
   * token is missing/expired/wrong-type or the owner no longer exists.
   */
  async resolveSession(
    token: string,
    expectedType: SessionOwnerType,
    ownerModel: Model<any>,
  ): Promise<{ owner: any; session: any } | null> {
    if (!token) return null;
    const session = await this.sessionModel.findOne({ token, type: expectedType }).lean();
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      await this.sessionModel.deleteOne({ _id: session._id });
      return null;
    }
    const owner = await ownerModel.findById(session.ownerId).lean();
    if (!owner) return null;
    return { owner, session };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.memberModel.findOne({ memberEmail: input.memberEmail.toLowerCase() }).lean();
    if (existing) {
      throw new AppException(HttpStatus.CONFLICT, Message.EMAIL_ALREADY_EXISTS);
    }
    const memberPassword = await this.hashPassword(input.memberPassword);
    const created = await this.memberModel.create({
      memberEmail: input.memberEmail,
      memberPassword,
      memberFirstName: input.memberFirstName,
      memberLastName: input.memberLastName,
      memberPhone: input.memberPhone,
      memberCompanyName: input.memberCompanyName,
    });
    const member = created.toObject();
    delete member.memberPassword;
    const token = await this.createSession(member._id, SessionOwnerType.MEMBER);
    return { token, member: member as Member };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const member = await this.memberModel
      .findOne({ memberEmail: input.memberEmail.toLowerCase() })
      .select('+memberPassword');
    if (!member) {
      throw new AppException(HttpStatus.UNAUTHORIZED, Message.INVALID_CREDENTIALS);
    }
    if (member.memberStatus === MemberStatus.BLOCKED) {
      throw new AppException(HttpStatus.FORBIDDEN, Message.ACCOUNT_BLOCKED);
    }
    const ok = await this.comparePassword(input.memberPassword, member.memberPassword);
    if (!ok) {
      throw new AppException(HttpStatus.UNAUTHORIZED, Message.INVALID_CREDENTIALS);
    }
    const safe = member.toObject();
    delete safe.memberPassword;
    const token = await this.createSession(safe._id, SessionOwnerType.MEMBER);
    return { token, member: safe as Member };
  }

  async logout(token: string): Promise<void> {
    await this.sessionModel.deleteOne({ token });
  }
}
