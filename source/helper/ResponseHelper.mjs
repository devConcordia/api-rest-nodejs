
import fs from 'fs';

/** ResponseHandler
 *	
 */
export default class ResponseHelper {
	
	constructor( response ) {
		
		this.response = response;
		
	}
	
	/** replyNoContent
	 *	
	 */
	replyNoContent() {
		
		const { response } = this;
		
		response.statusCode = 204;
		response.end('');
		
	}
	
	/** reply
	 *	
	 *	@param {Number} statusCode		200 | 201 | 400 | ...
	 *	@param {String} contentType		mime-type; charset
	 *	@param {String} content
	 */
	reply( statusCode, contentType, content ) {
		
		const { response } = this;
		
		response.setHeader('Content-Type', contentType );
		response.setHeader('Content-Length', content.length );
		
		response.statusCode = statusCode;
		response.end( content );
		
	}
	
	/** reply
	 *	
	 *	@param {Number} statusCode		200 | 201 | 400 | ...
	 *	@param {String} contentType		mime-type; charset
	 *	@param {String} path
	 *	@param {fs.Stats} stat			from fs.statSync (Optional)
	 */
	replyFile( statusCode, contentType, path, stats = null ) {
		
		const { response } = this;
		
		if( !stats ) stats = fs.statSync( path );
		
		response.statusCode = 200;
		response.setHeader( 'Content-Type', contentType );
		response.setHeader( 'Content-Length', stats.size );
		
		///
		let readStream = fs.createReadStream( path );
		
		readStream.on('open', function() { readStream.pipe( response ) });
		readStream.on('pause', function() { readStream.resume() });
		readStream.on('end', function() { response.end() });
			
	}
	
	/** replyJson
	 *
	 *	@param {Number} statusCode		200 | 201 | 400 | ...
	 *	@param {Object|String} content
	 */
	replyJson( statusCode, content ) {
		
		if( typeof content != 'string' )
			content = JSON.stringify( content );
		
		this.reply( statusCode, 'application/json', content );
		
	}
	
	/* ... */
	
	/** replyError
	 *	
	 *	Default is `replyJson`, use the `SetErrorHandler` to change it.
	 *	
	 *	@param {Number} status			200 | 201 | 400 | ...
	 *	@param {String} error			error name
	 *	@param {String} message			error message
	 */
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
