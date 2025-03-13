
import Basic from '../auth/Basic.mjs';
import Bearer from '../auth/Bearer.mjs';
import JSONWebToken from '../auth/JSONWebToken.mjs';

/** RequestHandler
 *	
 */
export default class RequestHelper {
	
	/** 
	 *	
	 *	
	 */
	constructor( request, enpointPath, body ) {
		
		this.request = request;
		this.enpointPath = enpointPath;
		this.body = body;
		
	}
	
	getURL() {
		
		return this.request.url;
		
	}
	
	getBasicAuth() {
		
		return Basic.From( this.request.headers.authorization );
		
	}
	
	getBearerAuth() {
		
		return Bearer.From( this.request.headers.authorization );
		
	}
	
	getJWTAuth() {
		
		return JSONWebToken.From( this.request.headers.authorization );
		
	}
	
	
	getBodyData() {
		
		let headers = this.request.headers;
		let output = this.body;
		
		if( 'content-type' in headers ) {
			if( headers['content-type'] == 'application/json' ) {
				try {
					
					return JSON.parse( output );
					
				} catch(err) {
					
					/// return null on decode failure
					return null;
					
				}
			}
		}
		
		return output;
		
	}
	
	getPathData() {
		
		let output = new Object();
		
		let shape = this.enpointPath.replace(/\?(.*)$/, "").replace(/\#(.*)$/, "").split(/\//).filter(e=>e!='');
		
		let url = decodeURI( this.request.url )
					.replace(/\?(.*)$/, "").replace(/\#(.*)$/, "")
					.split(/\//).filter(e=>e!='');
		
		for( let i = 0; i < shape.length; i++ ) {
			
			if( (/^\{.*\}$/).test( shape[i] ) ) 
				output[ shape[i].replace(/[\{\}]/g, '') ] = url[i];
			
		}
		
		return output;
		
	}
	
	getQueryData() {
		
		/// remove fragment (#fragment) and get query (?query)
		let query = this.request.url.replace(/\#(.*)$/, "").split(/\?/)[1];
		let output = new Object;
		
		if( query ) { 
		
			let list = query.split(/\&/gi);
			
			for( let item of list ) {
				
				let [ key, value ] = item.split(/\=/gi);
				
				output[ key ] = value;
				
			}
		
		}
		
		return output;
		
	}
	
}
