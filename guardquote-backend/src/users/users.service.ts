import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { DATABASE_PROVIDER } from '../database/database.module';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_PROVIDER) private db: Knex) {}

  async create(userData: any) {
    const [id] = await this.db('users').insert(userData);
    return this.findById(id);
  }

  async findByEmail(email: string) {
    return this.db('users').where({ email }).first();
  }

  async findById(id: number) {
    return this.db('users').where({ id }).first();
  }

  async update(id: number, userData: any) {
    await this.db('users').where({ id }).update(userData);
    return this.findById(id);
  }

  async delete(id: number) {
    return this.db('users').where({ id }).delete();
  }

  async findAll() {
    return this.db('users').select();
  }
}
