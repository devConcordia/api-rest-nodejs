
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

/** getHMAC
 *	
 *
 * @param {String} secretKey
 * @param {String} message
 * @param {String} hashType
 * @return {Boolean}
 */
function getHmac( hashType, secretKey, message ) {
    
	return crypto.createHmac( hashType, secretKey ).update( message ).digest('base64');
	
	/*
	const expectedHmac = crypto.createHmac( hashType, secretKey ).update( message ).digest().toString('base64');

	console.log( 'verifyHMAC' )
	console.log( receivedHmac )
	console.log( expectedHmac )
	console.log( '' )
	
	return receivedHmac == expectedHmac;
/**/
//	const expectedHmac = crypto.createHmac( hashType, secretKey ).update( message ).digest();
//	
//	console.log( 'verifyHMAC' )
//	console.log( receivedHmac )
//	console.log( expectedHmac )
//	console.log( '' )
//	
//	return crypto.timingSafeEqual( Buffer.from( receivedHmac ), expectedHmac );
	
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

/** JsonWebToken
 *	
 */
export default class JsonWebToken {
	
	constructor( token ) {
		
		token = token.split('.');
		
		this.token = token;
		
		this.header = json_decode( base64url_decode( token[0] ) );
		this.payload = json_decode( base64url_decode( token[1] ) );
		
		/// convert base64url to base64 (replaces `-_` to `+/`)
		let sign = token[2].replace(/\-/g, '+').replace(/\_/g, '/');
		
		/// add base64 padding
		this.signature = sign + '='.repeat((4 - (sign.length % 4)) % 4);
		
	}
	
	/**	verifySign
	 *	
	 *	@param {String} key
	 *	@param {String} alg		HS256 | HS384 | HS512 | RS256 | RS384 | RS512
	 *	@return {Boolean}
	 */
	verifySign( key, alg = '' ) {
		
		/// 
		if( alg == '' ) 
			alg = this.header.alg;
		
		///
		let hashType = "sha"+ alg.substring( 2 );
		
		let data = this.token[0] +"."+ this.token[1];
		
		///
		switch( alg ) {
			
			case 'HS256':
			case 'HS384':
			case 'HS512':
				return getHmac( hashType, key, data ) == this.signature;
				break;
			
			case 'RS256':
			case 'RS384':
			case 'RS512':
				return verifySignature( key, data, this.signature, hashType );
				break;
			
		}
		
		return false;
	
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
				return new JsonWebToken( Buffer.from( auth_data[1], 'base64' ).toString() );
		
		}
		
		return null;
		
	}
	
}

