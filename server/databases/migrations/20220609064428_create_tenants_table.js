/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('tenants', function (table) {
        table.increments();
        table.string('code').unique().nullable().comment("code generated from id")
        table.string('name').nullable();
        table.string('email').nullable();
        table.integer('phone').nullable();
        table.string('address').nullable();
        table.string('state').nullable().defaultTo('deactive').comment("whether the company's status is approved or not");
        table.jsonb('others').defaultTo('{}').comment("more information");
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('tenants');
};