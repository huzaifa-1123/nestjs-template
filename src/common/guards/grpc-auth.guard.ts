import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GrpcUser } from '../types';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context.getType();

    if (type !== 'rpc') {
      return true; // Skip for non-gRPC requests
    }

    try {
      const metadata = context.switchToRpc().getContext();
      const userHeader = metadata.get('user');

      if (!userHeader || userHeader.length === 0) {
        throw new UnauthorizedException('User metadata is missing');
      }

      // Parse the user object from the metadata
      let user: GrpcUser;
      try {
        user = JSON.parse(userHeader[0]);
      } catch (error) {
        throw new UnauthorizedException('Invalid user metadata format');
      }

      // Validate user object structure
      if (!user.uuid || !user.email || !user.userPermission) {
        throw new UnauthorizedException('User metadata is incomplete');
      }

      // Attach user to the context for later use
      metadata.user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
