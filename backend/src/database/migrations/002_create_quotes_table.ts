import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('quotes', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('quote_type').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.decimal('estimated_amount', 10, 2).nullable();
    table.text('description').nullable();
    table.string('coverage_type').nullable();
    table.string('coverage_level').nullable();
    table.json('health_info').nullable();
    table.string('employment_status').nullable();
    table.string('industry').nullable();
    table.integer('num_employees').nullable();
    table.decimal('annual_revenue', 15, 2).nullable();
    table.json('business_info').nullable();
    table.timestamps(true, true);
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('quotes');
}
