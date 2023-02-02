/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('wallet_history', function (table) {
		table.increments()
		table.string('stock').notNullable()
		table.string('email').notNullable()
		table.string('amount').notNullable()
		table.string('acquisition_price').notNullable()
		table.string('acquisition_price_date').notNullable()
	})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('wallet_history')
}
