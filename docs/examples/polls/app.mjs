
import fs from 'fs';

import RestServer from '../../../source/RestServer.mjs';
import Endpoint from '../../../source/Endpoint.mjs'

/// 
/// For testing purposes, the auth.json contain user credentials to verify the JWT
/// 
const users_list = JSON.parse( fs.readFileSync("./auth.json") );


/**	verifyAuth
 *	
 */
function verifyAuth( req, res ) {
	
	let auth = req.getJWTAuth();
	
	if( auth ) {
		
		let user = auth.header.sub;
		
		if( user in users_list )
			if( auth.verifySign( users_list[ user ] ) )
				return auth;
		
	}
	
	res.replyError( 401, "Unauthorized", "The request require authentication" );
	
}


/** Polls
 *	
 */
class Polls extends Endpoint {
	
	/// get poll lost
	onGet( req, res ) {
		
		let { id } = req.getPathData();
		
		if( !id ) {
			
			let files = fs.readdirSync( './data/' )
				.filter(e => !e.endsWith('.votes.csv'))
				.map(e=>e.replace('.json', ''));
			
			res.replyJson(200, files );
		
		} else {
			
			let path = './data/'+ id +'.json';
			
			if( fs.existsSync( path ) ) {
			
				res.reply( 200, 'application/json', fs.readFileSync( path ) );
			
			} else {
				
				res.replyError(404, "Not Found", "Poll '"+ id +"' not found");
		
			}
			
		}
		
	}
	
	/// create a new poll
	onPost( req, res ) {
		
		/// if has't a auth, the request will respond with a 401 error 
		let auth = verifyAuth( req, res );
		
		///
		let id = Date.now();
		let data = req.getBodyData();
		
		let poll = new Object;
			poll.title = data.title;
			poll.description = data.description;
			poll.form = new Array(); 
			
		for( let item in data.form ) {
			
			let question = item.question,
				options = item.options;
			
			poll.form.push({ question, options });
			
		}
		
		fs.writeFileSync( './data/'+ id +'.json', JSON.stringfy( poll, null, '\t' ) );
		
		res.replyJson(201, { id });
		
	}
	
}

/** Vote
 *	
 */
class Vote extends Endpoint {
	
	/// get a poll results
	onGet( req, res ) {
		
		let { id } = req.getPathData();
		
		let pathVotes = './data/'+ id +'.votes.csv';
		
		if( fs.existsSync( pathVotes ) ) {
			
			res.reply(200, 'text/plain', fs.readFileSync(pathVotes) );
			
		} else {
			
			res.replyError(404, "Not Found", "Poll votes not found" );
			
		}
		
	}
	
	/// add vote to a poll
	onPost( req, res ) {
		
		let { id } = req.getPathData();
		
		let pathVotes = './data/'+ id +'.votes.csv';
		
		/// check if poll id exists
		if( fs.existsSync( './data/'+ id +'.json' ) ) {
			
			fs.appendFileSync( pathVotes, req.getBodyData().join(';') +'\n' );
			
			res.replyJson(204, '{}');
			
		} else {
			
			res.replyError(404, "Not Found", "Poll not found" );
			
		}
		
	}
	
}

///
///
///

const privateKey = fs.readFileSync('./setup/private.key').toString();
const certificate = fs.readFileSync('./setup/certificate.cer').toString();

/// 
/// 	add 
/// 
let rest = new RestServer( 'demo.alpha', 80, certificate, privateKey );
	rest.append( new Polls( '/polls/{id}' ) );
	rest.append( new Vote( '/polls/{id}/vote' ) );
