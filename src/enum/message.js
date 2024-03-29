
const Message = Object.freeze({
	Session: {
		NoUserRegistered: 'Nenhum usuário cadastrado',
		UserNotFound: 'Usuário não foi encontrado',
		InvalidPassword: 'Senha inválida', 
		ExpiredSession: 'Sessão expirada',
		UserCreatedSuccessfully: 'Usuário criado com sucesso',
		UserIsAlreadyRegistered: 'Usuário já cadastrado',
		NoUserFoundWithEmail: 'Nenhum usuário encontrado com o e-mail: ',
		UserWithoutPermission: 'Usuário sem permissão'
	},
	Investiment: {
		StockNotFound: 'Esse ativo não existe',
		ActiveAlreadyRegistered: 'Ativo já cadastrado',
		StockAddedSuccessfully: 'Ativo adicionado com sucesso'
	},
	General: {
		DeletedSuccessfully: 'Deletado com sucesso'
	}
})

module.exports = Message