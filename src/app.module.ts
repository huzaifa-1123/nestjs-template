import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './common/config/Logger';
import { DatabaseModule } from './database/database.module';
import { RepositoryModule } from './repository/repository.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, RepositoryModule, DatabaseModule, UserModule],
})
export class AppModule {}
