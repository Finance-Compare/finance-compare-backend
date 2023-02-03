const ip = require('ip')
const app = require('./config/app')
const dotenv = require('dotenv')
dotenv.config()

const server_port = process.env.SERVER_PORT

app.listen(server_port, () => {
	const ipAddress = ip.address()
	console.log('App listening in http://localhost:' + server_port + ' or http://' + ipAddress + ':' + server_port)
})