
import fs from 'fs';

import RestServer from '../../source/RestServer.mjs';
import Endpoint from '../../source/Endpoint.mjs'


class HelloWorldEndpoint extends Endpoint {
	
	/** 
	 *	
	 *	@param {RequestHelper} req
	 *	@param {ResponseHelper} res
	 */
	onGet( req, res ) {
		
		let { name } = req.getPathData();
		
		/// response a OK, 200 http request
		res.replyJson(200, { message: 'Hello '+ name });
		
	}
	
	onPost( req, res ) {
		
		let { name } = req.getPathData();
		
		let data = req.getBodyData();
		
		/// response a OK, 200 http request
		res.replyJson(200, { message: name +' has uload a data' });
		
	}
	
//	onPut( req, res ) { }
//	onPatch( req, res ) { }
//	onDelete( req, res ) { }

}

const privateKey = fs.readFileSync('./accounts/setup/private.key').toString();
const certificate = fs.readFileSync('./accounts/setup/certificate.cer').toString();

let rest = new RestServer( 'demo.alpha', certificate, privateKey );
	rest.append( new HelloWorldEndpoint( '/api/{name}', true ) );


