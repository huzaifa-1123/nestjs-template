import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
