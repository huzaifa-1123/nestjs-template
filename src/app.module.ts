import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './common/config/Logger';
import { DatabaseModule } from './database/database.module';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from '../modules/users/users.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, RepositoryModule, DatabaseModule, UserModule],
})
export class AppModule {}
