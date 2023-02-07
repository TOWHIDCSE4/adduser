
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('code').unique().nullable().comment("code generated from id")
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.string('firstName').nullable();
    table.string('lastName').nullable();
    table.string('email').nullable();
    table.string('image').nullable();
    table.timestamp('birthday').nullable();
    table.integer('phone').nullable();
    table.jsonb('others').defaultTo('{}').comment("more information");

    //2fa
    table.string('twofaKey').unique().notNullable().comment("key verify 2fa")
    table.integer('twofa').defaultTo(1).notNullable().comment("check 2fa on and off")
    table.integer('isFirst').defaultTo(1).notNullable().comment("is login first")

    //link role
    table.integer('roleId').index().references('id').inTable('roles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('tenantId').nullable().index().references('id').inTable('tenants')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');

    table.integer('createdBy').nullable().index().references('id').inTable('users')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');
    table.integer('updatedBy').nullable().index().references('id').inTable('users')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};