/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('documents', function (table) {
    table.increments();
    table.string('name').nullable();
    table.jsonb('content').nullable();
    table.integer('status').nullable();
    table.integer('documentTemplateId').index().references('id').inTable('document_templates')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

      
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
 return knex.schema.dropTable('documents');
};
