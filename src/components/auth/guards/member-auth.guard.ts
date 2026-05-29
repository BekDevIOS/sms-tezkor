import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../../../libs/enums/common';
import { SessionOwnerType } from '../../../libs/enums/session.enum';
import { AuthenticatedRequest } from '../../../libs/types/authenticated-request';
import { MODEL } from '../../../libs/types/model-names';
import { AuthService } from '../auth.service';

function extractBearer(req: AuthenticatedRequest): string | null {
  const header = req.headers['authorization'];
  if (!header || typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token.trim();
}

@Injectable()
export class MemberAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractBearer(req);
    if (!token) throw new UnauthorizedException(Message.TOKEN_NOT_EXIST);

    const resolved = await this.authService.resolveSession(token, SessionOwnerType.MEMBER, this.memberModel);
    if (!resolved) throw new UnauthorizedException(Message.NOT_AUTHENTICATED);

    const { owner, session } = resolved;
    req.member = {
      _id: String(owner._id),
      memberEmail: owner.memberEmail,
      memberRole: owner.memberRole,
      memberStatus: owner.memberStatus,
    };
    req.session = { _id: String(session._id), token: session.token, type: session.type };
    return true;
  }
}
