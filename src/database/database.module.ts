import { Global, Module, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './models'; // Import schema
import { DATABASE_CONNECTION } from '../common/config/constant';
import { InfoLog, ErrorLog } from '../common/helpers/logger.utils';

export type Database = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DB_URI');
        const pool = new Pool({
          connectionString,
        });

        try {
          const client = await pool.connect();
          // @ts-ignore
          const dbName = client.database;
          InfoLog(`Database connected successfully to: ${dbName}`, {}, 'DatabaseModule');
          client.release();
        } catch (error) {
          ErrorLog('Database connection failed', error, 'DatabaseModule');
          throw error;
        }

        // Store the pool for graceful shutdown
        // @ts-ignore
        DatabaseModule.pool = pool;

        return drizzle(pool, {
          schema,
          logger: process.env.NODE_ENV !== 'production',
        });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule implements OnModuleDestroy {
  private static pool: Pool;

  async onModuleDestroy() {
    if (DatabaseModule.pool) {
      await DatabaseModule.pool.end();
    }
  }
}
