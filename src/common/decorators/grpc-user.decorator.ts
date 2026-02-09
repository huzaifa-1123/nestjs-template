import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GrpcUser } from '../types';

export const GrpcUserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): GrpcUser => {
    const metadata = ctx.switchToRpc().getContext();
    return metadata.user;
  },
);
