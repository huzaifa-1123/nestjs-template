import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RepositoryModule } from './repository/repository.module';
import { ConfigModule } from '@nestjs/config';
import { ResponseService } from './common/helpers/response.service';
import { LoggerModule } from './common/config/logger.config';
import { HealthModule } from './modules/health/health.module';
import { ExampleModule } from './modules/example/example.module';

@Global()
@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class GlobalModule {}


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    RepositoryModule,
    DatabaseModule,
    HealthModule,
    ExampleModule,
  ],
})
export class AppModule {}
