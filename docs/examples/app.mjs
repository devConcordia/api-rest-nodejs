
import fs from 'fs';
import REST from '../../source/index.mjs';


class HelloWorldEndpoint extends REST.Endpoint {
	
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

let service = new REST.Service( 'demo.alpha', certificate, privateKey );
	service.append( new HelloWorldEndpoint( '/api/{name}', true ) );


