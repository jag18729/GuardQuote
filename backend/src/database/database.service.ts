import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { DATABASE_PROVIDER } from './database.module';

@Injectable()
export class DatabaseService {
  constructor(@Inject(DATABASE_PROVIDER) private db: Knex) {}

  getQueryBuilder() {
    return this.db;
  }

  async runMigrations() {
    await this.db.migrate.latest();
  }

  async rollbackMigrations() {
    await this.db.migrate.rollback();
  }
}
