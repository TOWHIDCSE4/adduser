
exports.up = function (knex) {
  return knex.schema.createTable('roles', function (table) {
    table.increments();
    table.string('code').unique().nullable().comment("code generated from id")
    table.string('name').nullable();
    table.text('description').nullable();
    table.string('key').nullable();
    table.jsonb('others').defaultTo('{}').comment("more information");

    table.integer('parentId').nullable().index().references('id').inTable('roles')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');
    table.integer('tenantId').nullable().index().references('id').inTable('tenants')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');
    table.integer('createdBy').nullable().index().references('id').inTable('roles')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');
    table.integer('updatedBy').nullable().index().references('id').inTable('roles')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('roles');
};
