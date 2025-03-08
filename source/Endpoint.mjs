
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
		
		const key = 'on'+ capitalize( method );
		const handler = this[ key ];
		
		if( typeof handler == 'function' ) {
			
			handler.call( this, req, res );
			
		} else {
			
			res.replyError( 405, "Method Not Allowed", "The HTTP method "+ request.method +" is not supported for this endpoint." );
			
		}
		
	}
	
	on( method, handler ) {
		
		const key = 'on'+ capitalize( method );
		
		if( typeof handler == 'function' ) {
			
			this[ key ] = handler;
			
		} else {
			
			delete this[ key ];
			
		}
		
	}
	
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
