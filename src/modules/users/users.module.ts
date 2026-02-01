import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { ResponseService } from 'src/common/helpers/response.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ResponseService],
})
export class UserModule {}
