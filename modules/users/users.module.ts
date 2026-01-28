import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { Response } from '../../src/common/helpers/response.service';

@Module({
  controllers: [UserController],
  providers: [UserService, Response],
})
export class UserModule {}
