
import os from 'os';
import fs from 'fs';
import http from 'http';
import https from 'https';

import RequestHelper from './helper/RequestHelper.mjs';
import ResponseHelper from './helper/ResponseHelper.mjs';

import Endpoint from './Endpoint.mjs';

/** RestServer
 *	
 *	RFC 9110 - HTTP methods, status code, and headers
 *	RFC 3986 - URI (Uniform Resource Identifier) 
 *	RFC 6454 - CORS (Cross-Origin Resource Sharing)
 *	RFC 5988 - HATEOAS (Hypermedia as the Engine of Application State)
 *	
 *	When create a rest server, consider the [Open AIP Specification](https://swagger.io/specification/)
 *	
 */
export default class RestServer {
	
	constructor( host = "127.0.0.1", cert, key, cors = [] ) {
		
		let instance = http;
		let port = 80;
		let options = new Object;
		
		if( cert && key ) {
			
			port = 443;
			
			instance = https;
			
			options.key = key;
			options.cert = cert;
			options.requestCert = false;
			options.rejectUnauthorized = true;
			
		}
		
		/// default response header
		let header = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization', 
			'Access-Control-Max-Age': 86400
		};
		
		///
		let endpoints = new Array();
		
		/** getEndpoint
		 *	
		 *	@param {String} path
		 */
		function getEndpoint( path ) {
			
			let input = path.replace(/\?(.*)$/, "").replace(/\#(.*)$/, "").split(/\//).filter(e=>e!='');
			
			let output = null;
			
			///
			for( let e of endpoints ) {
				
				let base = e.path.split(/\//).filter(e => e!='');
				
				let flag = true;
				
				for( let i = 0; i < input.length; i++ ) {
					
					if( (/^\{.*\}$/).test( base[i] ) ) continue;
					
					if( base[i] != input[i] ) {
						flag = false;
						break;
					}
					
				}
				
				if( flag ) {
					
					return e;
					
				} else {
					
					if( !output && e.isDefault ) output = e;
					
				}
				
			}
			
			return output;
			
		};
		
		///
		let server = instance.createServer( options );
			server.addListener("request", function( request, response ) {
				
				/// debug
			//	console.log( request.method, request.headers.origin, request.url );
			//	console.log( request.method, request.url );
			//	console.log( request );
			//	console.log( request.client.servername );
			//	console.log( request.headers.origin );
				
				/// set default header
				for( let name in header )
					response.setHeader( name, header[name] );
				
			//	if( cors.includes( request.headers.origin ) ) 
			//		response.setHeader( 'Access-Control-Allow-Origin', request.headers.origin );
				
				
				///
				let body_data = "";
				
				request.on('data', function( chunk ) { body_data += chunk });
				
				request.on('end', function() {
					
					/// get enpoint
					let endpoint = getEndpoint( request.url );
					
					let res = new ResponseHelper( response );
					
					/// check if endpoint is active
					if( !endpoint )
						return res.replyError( 404, "Not Found", "The requested resource was not found on this server." );
					
					/// the endpoint.path is needed in `RequestHelper.getPathData`
					let req = new RequestHelper( request, endpoint.path, body_data );
					
					///
					endpoint.dispatch( request.method, req, res );
					
				});
				
			});
		
		///
		server.listen( port, host );
		
		///
		this.endpoints = endpoints;
		this.header = header;
		this.server = server;
		this.endpointDefault = null;
		
		///
		console.log( 'server running at '+ host +':'+ port );
		
	}
	
	/** append
	 *	
	 *	@param {Endpoint} endpoint
	 *	@param {Boolean} isDefault
	 */
	append( endpoint, isDefault = false ) {
		
		if( endpoint instanceof Endpoint ) {
			if( !this.endpoints.includes(endpoint) ) {
				this.endpoints.push( endpoint );
			}
		}
		
	}
	
	/** append
	 *	
	 *	@param {Endpoint} endpoint
	 */
	remove( endpoint ) {
		
		this.endpoints.filter( e => e != endpoint );
		
	}
	
}

