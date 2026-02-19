import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex from 'knex';
import { DatabaseService } from './database.service';

export const DATABASE_PROVIDER = 'DATABASE';

@Module({
  providers: [
    {
      provide: DATABASE_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('DB_PASSWORD');
        if (!password) {
          throw new Error('DB_PASSWORD environment variable is required');
        }
        return knex({
          client: 'pg',
          connection: {
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5432),
            user: configService.get('DB_USER', 'guardquote'),
            password,
            database: configService.get('DB_NAME', 'guardquote'),
          },
          migrations: {
            directory: './src/database/migrations',
          },
        });
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: [DATABASE_PROVIDER, DatabaseService],
})
export class DatabaseModule {}
