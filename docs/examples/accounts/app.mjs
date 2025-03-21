
import crypto from 'crypto';
import fs from 'fs';

import RestServer from '../../../source/RestServer.mjs';
import Endpoint from '../../../source/Endpoint.mjs'

/**	getUserID
 *	
 *	ID is md5( user ) in base 36.
 *	
 */
function getUserID( user ) {
	
	return BigInt( '0x'+ crypto.createHash( 'md5' ).update( user ).digest('hex') ).toString(36).toUpperCase();
	
}

/**	verifyAuth
 *	
 */
function verifyAuth( req, res ) {
	
	let auth = req.getJWTAuth();
	
	if( auth ) {
		
		let id = getUserID( auth.payload.sub );
		let path = "./data/"+ id +".json";
		
		if( fs.existsSync( path ) ) {
			
			let user = JSON.parse( fs.readFileSync( path ) );
			
			if( auth.verifySign( user.key ) )
				return { auth, user, id };
			
		}
	}
	
	res.replyError( 401, "Unauthorized", "The request require authentication" );
	
	return null;
	
}

/** Accounts
 *	
 */
class Accounts extends Endpoint {
	
	/// Sign In
	onGet( req, res ) {
		
		/// if has't a auth, the request will respond with a 401 error 
		let data = verifyAuth( req, res );
		
		if( data != null ) {
		
			/// remove key of response
			delete data.user.key;
			
			res.replyJson(200, data.user);
		
		}
		
	}
	
	/// Sign Up
	onPost( req, res ) {
		
		let data = req.getBodyData();
		
		if( !data.user || !data.key ) 
			res.replyError(400, "Bad Request", "Invalid username or password" );
		
		let id = getUserID( data.user );
		
		if( fs.existsSync( "./data/"+ id +".json" ) ) 
			res.replyError(400, "Bad Request", "User has already been registered" );
		
		///
		fs.writeFileSync( "./data/"+ id +".json", JSON.stringify( data, null, '\t' ) );
		
		delete data.key;
		
		///
		res.replyJson(200, data);
		
	}
	
}

///
///
///

const privateKey = fs.readFileSync('./setup/private.key').toString();
const certificate = fs.readFileSync('./setup/certificate.cer').toString();

/// 
let rest = new RestServer( 'demo.alpha', 80, certificate, privateKey );
	rest.append( new Accounts( '/accounts' ) );


