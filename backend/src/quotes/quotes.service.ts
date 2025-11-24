import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { DATABASE_PROVIDER } from '../database/database.module';

@Injectable()
export class QuotesService {
  constructor(@Inject(DATABASE_PROVIDER) private db: Knex) {}

  async create(quoteData: any) {
    const [id] = await this.db('quotes').insert(quoteData);
    return this.findById(id);
  }

  async findById(id: number) {
    const quote = await this.db('quotes').where({ id }).first();
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    return quote;
  }

  async findByUserId(userId: number) {
    return this.db('quotes').where({ user_id: userId });
  }

  async update(id: number, quoteData: any) {
    const quote = await this.findById(id);
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    await this.db('quotes').where({ id }).update(quoteData);
    return this.findById(id);
  }

  async delete(id: number) {
    return this.db('quotes').where({ id }).delete();
  }

  async findAll(limit = 50, offset = 0) {
    return this.db('quotes').limit(limit).offset(offset);
  }
}
