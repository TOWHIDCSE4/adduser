/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("user_temps", function (table) {
		table.increments();
		table.string("username").nullable();
		table.string("email").nullable();
		table.string("password").nullable();
		
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("user_temps");
};