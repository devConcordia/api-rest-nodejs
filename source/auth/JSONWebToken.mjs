
import crypto from 'crypto';


/** base64url_encode
 *	
 *		Replaces + by - (minus)
 *		Replaces / by _ (underline)
 *		Does not require a padding character Forbids line separators
 *	
 *	@param {String} input
 *	@return {String}
 */
function base64url_encode( input ) {
	
	return Buffer.from( input ).toString('base64').replace(/\+/gm, '-').replace(/\//gm, '_');
	
}

/** base64url_decode
 *	
 *		Replaces + by - (minus)
 *		Replaces / by _ (underline)
 *		Does not require a padding character Forbids line separators
 *	
 *	@param {String} input
 *	@return {String}
 */
function base64url_decode( input ) {
	
	return Buffer.from( input.replace(/\-/gm, '+').replace(/\_/gm, '/'), 'base64' ).toString();
	
}

/** json_decode
 *	
 */
function json_decode( input ) {
	
	try { return JSON.parse(input); } catch(err) {}
	
	return null;
	
}

/** verifyHMAC
 *
 *	 Verifica se um HMAC recebido é válido
 *
 * @param {String} secretKey
 * @param {String} message
 * @param {String} receivedHmac
 * @param {String} hashType
 * @return {Boolean}
 */
function verifyHMAC( secretKey, message, receivedHmac, hashType = 'sha256' ) {
    
	const expectedHmac = crypto.createHmac( hashType, secretKey ).update( message ).digest();
	
	return crypto.timingSafeEqual( Buffer.from( receivedHmac ), expectedHmac );
	
}

/**	verifySignature
 * 
 *	@param {String} publicKey 		PEM
 *	@param {String} data
 *	@param {String} signature
 *	@param {String} hashType		sha256
 *	@return {Boolean}
 */
function verifySignature( publicKey, data, signature, hashType = 'sha256' ) {
	
    let verifier = crypto.createVerify( hashType );
		verifier.update( data );
		verifier.end();
	
    return verifier.verify( publicKey, signature );
	
}


/** JSONWebToken
 *	
 *	@ref https://datatracker.ietf.org/doc/html/rfc6750
 *	
 *	Este método é mais comumente associado ao protocolo OAuth 2.0,
 *	do qual são utilizados os JSONWebToken e JSONWebSignature
 *	O cliente recebe um token de acesso (Bearer token) após a
 * 	autenticação bem-sucedida com um servidor de autorização.
 *	
 *	O token é então enviado no cabeçalho Authorization como Bearer <token>
 *	
 *		Authorization: Bearer base64url_encode( HEAD ) . base64url_encode( PAYLOAD ) . base64url_encode( SIGNATURE )
 *	
 */
export default class JSONWebToken {
	
	constructor( token ) {
		
		/// para a plataforma VirtualID, o JSONWebToken 
		/// deve estar codificado em base64
		token = token.split('.');
		
		this.token = token;
		
		this.head = json_decode( base64url_decode( token[0] ) );
		this.payload = json_decode( base64url_decode( token[1] ) );
		this.signature = token[2];
		
	}
	
	/**	verifySign
	 *	
	 *	@param {String} key
	 *	@param {String} alg		HS256 | HS384 | HS512 | RS256 | RS384 | RS512
	 *	@return {Boolean}
	 */
	verifySign( key, alg = '' ) {
		
		let sign = base64url_decode( this.signature );
		
		let data = this.token[0] +"."+ this.token[1];
		
		/// 
		if( alg == '' ) 
			alg = this.head.alg;
		
		///
		let hashType = "sha"+ alg.substring( 2 );
		
		///
		switch( alg ) {
			
			case 'HS256':
			case 'HS384':
			case 'HS512':
				return verifyHMAC( key, data, sign, hashType );
				break;
			
			case 'RS256':
			case 'RS384':
			case 'RS512':
				return verifySignature( key, data, sign, hashType );
				break;
			
		}
		
		return false;
	
	}
	
	/** From
	 *	
	 *	@param {String} authorization
	 */
	static From( authorization ) {
		
		let auth_data = authorization.split(" ");
		
		/// verifica se o scheme é do tipo `Bearer`
		/// caso não seja, encerra a requisição
		if( auth_data[0].toLowerCase() == "bearer" )
			return new JSONWebToken( Buffer.from( auth_data[1], 'base64' ).toString() );
		
		return null;
		
	}
	
}

