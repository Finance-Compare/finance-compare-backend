const connection = require('../config/db_connection')

module.exports = {


	async findByEmail(email) {
		return await connection('login').where('email', email).first()
	},

	async checkIfAdmin(email) {
		const user = await this.findByEmail(email)
		return user.type == 'admin'
	},

	async checkIfExists(email) {
		const user = await this.findByEmail(email)
		return user != null
	},

	async addNewUser(name, email, password, type) {

		if (type == null) {
			type = 'customer'
		}

		await connection('login').insert({
			name,
			email,
			password,
			type
		})

		return { name, email, permission: type }
	},

	async allUsers() {
		return await connection('login').select('*')
	}
}