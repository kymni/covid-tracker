
exports.up = async (knex) => {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable('covid', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('indicator')
    table.string('series')
    table.string('sub_series')
    table.date('parameter')
    table.integer('value')
    table.timestamp('date_updated')
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('covid');
};
