exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.text('username');
  });

  await knex.schema.createTable('groups', table => {
    table.increments('id').primary();
    table.text('name').notNullable();
  });

  await knex.schema.createTable('user_groups', table => {
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('group_id')
      .unsigned()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table.primary(['user_id', 'group_id']);
  });

  await knex.schema.createTable('messages', table => {
    table.increments('id').primary();
    table
      .integer('group_id')
      .unsigned()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamp('delivered').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('user_groups');
  await knex.schema.dropTableIfExists('groups');
  await knex.schema.dropTableIfExists('users');
};
