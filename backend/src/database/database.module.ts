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
        return knex({
          client: 'pg',
          connection: {
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5432),
            user: configService.get('DB_USER', 'guardquote'),
            password: configService.get('DB_PASSWORD', 'guardquote'),
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
