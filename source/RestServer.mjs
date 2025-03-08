
import os from 'os';
import fs from 'fs';
import http from 'http';
import https from 'https';

import RequestHelper from './helper/RequestHelper.mjs';
import ResponseHelper from './helper/ResponseHelper.mjs';

import Endpoint from './Endpoint.mjs';

/** RestServer
 *	
 */
export default class RestServer {
	
	constructor( host = "127.0.0.1", cert, key ) {
		
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
			
			///
			for( let e of endpoints ) {
				
				let base = e.path.split(/\//).filter(e => e!='');
				
			//	if( base.length != input.length ) continue;
				
				let flag = true;
				
				for( let i = 0; i < input.length; i++ ) {
					
					if( (/^\{.*\}$/).test( base[i] ) ) continue;
					
					if( base[i] != input[i] ) {
						flag = false;
						break;
					}
					
				}
				
				if( flag ) return e;
				
			}
			
			return null;
			
		};
		
		///
		let server = instance.createServer( options );
			server.addListener("request", function( request, response ) {
				
				/// debug
				console.log( request.method, request.url );
				
				/// set default header
				for( let name in header )
					response.setHeader( name, header[name] );
				
				///
				let body_data = "";
				
				request.on('data', function( chunk ) { body_data += chunk });
				
				request.on('end', function() {
					
					/// get enpoint
					let endpoint = getEndpoint( request.url );
					
					///
					let res = new ResponseHelper( response );
					
					/// check if endpoint is active
					if( !endpoint )
						return res.replyError( 404, "Not Found", "The requested resource was not found on this server." );
					
					let req = new RequestHelper( request, body_data );
					
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
		
		///
		console.log( 'server running at '+ host +':'+ port );
		
	}
	
	/** append
	 *	
	 *	@param {Endpoint} endpoint
	 */
	append( endpoint ) {
		
		if( endpoint instanceof Endpoint )
			if( !this.endpoints.includes(endpoint) )
				this.endpoints.push( endpoint );
		
	}
	
	/** append
	 *	
	 *	@param {Endpoint} endpoint
	 */
	remove( endpoint ) {
		
		this.endpoints.filter( e => e != endpoint );
		
	}
	
}
