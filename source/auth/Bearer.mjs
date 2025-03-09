
/** Bearer
 *	
 *	@ref https://datatracker.ietf.org/doc/html/rfc6750
 *	
 *	Este método é mais comumente associado ao protocolo OAuth 2.0,
 *	do qual são utilizados os JSONWebToken e JSONWebSignature.
 *	O cliente recebe um token de acesso (Bearer token) após a
 * 	autenticação bem-sucedida com um servidor de autorização.
 *	
 *	O token é então enviado no cabeçalho Authorization como Bearer <token>
 *	
 *	Esse método é mais seguro que o Basic Authentication, pois não 
 *	carregam informações confidenciais diretamente.
 *	
 */
export default class Bearer {
	
	constructor( token ) {
		
		this.token = token;
		
	}
	
	/** From
	 *	
	 *	@param {String} authorization
	 */
	static From( authorization ) {
		
		if( typeof authorization == 'string' ) {
			
			let auth_data = authorization.split(" ");
			
			/// verifica se o scheme é do tipo `Bearer`
			/// caso não seja, encerra a requisição
			if( auth_data[0].toLowerCase() == "bearer" )
				return new Bearer( Buffer.from( auth_data[1], 'base64' ).toString() );
			
		}
		
		return null;
		
	}
	
}
