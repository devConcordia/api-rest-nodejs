
import fs from 'fs';

import RestServer from '../../../source/RestServer.mjs';
import Endpoint from '../../../source/Endpoint.mjs'




/// hmac key  of client
const JWT_KEY = "123456";

/**	verifyAuth
 *	
 */
function verifyAuth( req, res ) {
		
	let auth = req.getJWTAuth();
	
	if( auth && auth.verifySign( JWT_KEY ) )
		return auth;
	
	res.replyError( 401, "Unauthorized", "The request require authentication" );
	
}


/** Polls
 *	
 */
class Polls extends Endpoint {
	
	/// lista de enquetes
	onGet( req, res ) {
		
		let { id } = req.getPathData();
		
		if( !id ) {
			
			let files = fs.readdirSync( './data/' )
				.filter(e => !e.endsWith('.votes.json'))
				.map(e=>e.replace('.json', ''));
			
			res.replyJson(200, files );
		
		} else {
			
			let path = './data/'+ id +'.json';
			
			if( fs.existsSync( path ) ) {
			
				res.reply( 200, 'application/json', fs.readFileSync( path ) );
			
			} else {
				
				res.replyJson(200, {
					"message": "Poll '"+ id +"' not founded"
				});
		
			}
			
		}
		
	}
	
	/// Cria uma nova enquete.
	onPost( req, res ) {
		
		let auth = verifyAuth( req, res );
		
		res.replyJson(201, {
			date: Date.now()
		});
		
	}
	
}

/** Vote
 *	
 */
class Vote extends Endpoint {
	
	/// Obtém os resultados de uma enquete.
	onGet( req, res ) {
		
		let { id } = req.getPathData();
		
		let pathVotes = './data/'+ id +'.votes.json';
		
		if( fs.existsSync( pathVotes ) ) {
			
			res.reply(200, 'application/json', fs.readFileSync(pathVotes) );
			
		} else {
			
			return res.replyError(404, "Not Found", "Poll votes not found" );
			
		}
		
	}
	
	/// Registra um voto na enquete.
	onPost( req, res ) {
		
		let { id } = req.getPathData();
		
		let pathVotes = './data/'+ id +'.votes.json';
		
		if( fs.existsSync( './data/'+ id +'.json' ) ) {
			
			let data = fs.existsSync( pathVotes )? JSON.parse( fs.readFileSync(pathVotes) ) : [];
				data.push( req.getBodyData() );
			
			fs.writeFileSync( pathVotes, JSON.stringify(data ) );
			
			res.replyJson(204, '{}');
			
		} else {
			
			return res.replyError(404, "Not Found", "Poll not found" );
			
		}
		
	}
	
}

///
///
///

const privateKey = fs.readFileSync('./setup/private.key').toString();
const certificate = fs.readFileSync('./setup/certificate.cer').toString();


///
let rest = new RestServer( 'demo.alpha', certificate, privateKey );
	rest.append( new Polls( '/polls/{id}' ) );
	rest.append( new Vote( '/polls/{id}/vote' ) );




/* 
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDE1MjcxMTUzOTMsImlhdCI6MTc0MTUyNzExMjM5M30.



*/