
/** ResponseHandler
 *	
 */
export default class ResponseHelper {
	
	constructor( response ) {
		
		this.response = response;
		
	}
	
	reply( statusCode, mimeType, content ) {
		
		let { response } = this; 
		
		response.setHeader('Content-Type', mimeType );
		
		response.statusCode = statusCode;
		response.end( content );
		
	}
	
	replyJson( statusCode, content ) {
		
		if( typeof content != 'string' )
			content = JSON.stringify( content );
		
		this.reply( statusCode, 'application/json', content );
		
	}
	
	/* ... */
	
	
	replyError( status, error, message ) {
		
		this.replyJson( status, { error, message, status });
		
	}
	
	/** SetErrorHandler
	 *	
	 *	@param {Function} handler		handler( status, error, message )
	 */
	static SetErrorHandler( handler ) {
		
		ResponseHandler.prototype.replyError = handler;
		
	}
	
}
