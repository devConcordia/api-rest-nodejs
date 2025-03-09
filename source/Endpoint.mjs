
/** capitalize
 *	
 */
function capitalize( input ) {
    
	return input.toLowerCase().replace(/^(\w)/, (match) => match.toUpperCase());
	
}


/** Endpoint
 *	
 */
export default class Endpoint {
	
	constructor( path ) {
		
		this.path = path;
		
	}
	
	dispatch( method, req, res ) {
		
		let auth = null;
		
		///
		/// converts a METHOD to getMethod
		/// 
		const key = 'on'+ capitalize( method );
		
		const handler = this[ key ];
		
		if( typeof handler == 'function' ) {
			
			handler.call( this, req, res, auth );
			
		} else {
			
			res.replyError( 405, "Method Not Allowed", "The HTTP method "+ request.method +" is not supported for this endpoint." );
			
		}
		
	}
	
	/// verifyAuth( req )
	
	/// onGet( req, res ) { ... }
	/// onPost( req, res ) { ... }
	/// onPut( req, res ) { ... }
	/// onPatch( req, res ) { ... }
	/// onDelete( req, res ) { ... }
	
	/** onOptions
	 *	
	 *	default response to method OPTIONS
	 *	
	 */
	onOptions( req, res ) {
		
		res.reply( 204, 'text/plain', '' );
		
	}
	
}
