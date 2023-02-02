/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('wallet', function (table) {
		table.increments()
		table.string('stock').notNullable()
		table.string('email').notNullable()
		table.integer('amount').notNullable()
		table.string('last_update').notNullable()
	})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('wallet')
}
