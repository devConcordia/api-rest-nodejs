
/** Basic
 *	
 *	@ref https://datatracker.ietf.org/doc/html/rfc7617
 *	
 *	O cliente envia as credenciais (normalmente nome de usuário e senha) 
 *	codificadas em base64 no cabeçalho Authorization:
 *	
 *		Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
 *		Authorization: Basic base64_encode(username:password)
 *	
 *	Atenção! As credenciais são enviadas em texto simples e podem ser interceptadas, 
 *	portanto, é recomendado o uso de HTTPS com Basic Authentication.
 *	
 */
export default class Basic {
	
	constructor( username, password ) {
		
		this.username = username;
		this.password = password;
		
	}
	
	static From( authorization ) {
		
		if( typeof authorization == 'string' ) {
			
			let auth_data = authorization.split(" ");
			
			/// verifica se o scheme é do tipo `Basic`
			/// caso não seja, encerra a requisição
			if( auth_data[0].toLowerCase() == "basic" ) {
				
				/// extrai credenciais
				let data = Buffer.from( auth_data[1], 'base64' ).toString();
				
				return new Basic( ...data.split(/:(.+)/, 2) );
			
			}
			
		}
		
		return null;
		
	}
	
}

