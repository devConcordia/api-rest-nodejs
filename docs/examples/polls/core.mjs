
import fs from 'fs';

import Endpoint from '../../../source/Endpoint.mjs'


/** Polls
 *	
 */
export class Polls extends Endpoint {
	
	/// lista de enquetes
	onGet( req, res ) {
		
		let [ polls, id ] = req.getPathData();
		
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
		
		res.replyJson(201, {
			date: Date.now()
		});
		
	}
	
}

/** Vote
 *	
 */
export class Vote extends Endpoint {
	
	/// Registra um voto na enquete.
	onPost( req, res ) {
		
		let [ polls, id ] = req.getPathData();
		
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

/** Results
 *	
 */
export class Results extends Endpoint {
	
	/// Obtém os resultados de uma enquete.
	onGet( req, res ) {
		
		let [ polls, id ] = req.getPathData();
		
		let pathVotes = './data/'+ id +'.votes.json';
		
		if( fs.existsSync( pathVotes ) ) {
			
			res.reply(200, 'application/json', fs.readFileSync(pathVotes) );
			
		} else {
			
			return res.replyError(404, "Not Found", "Poll votes not found" );
			
		}
		
	}
	
}

