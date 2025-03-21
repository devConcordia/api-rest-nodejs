
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
	
	/** 
	 *	
	 *	@param {String} path
	 *	@param {Boolean} isDefault
	 */
	constructor( path, isDefault = false ) {
		
		this.path = path;
		this.isDefault = isDefault;
		
	}
	
	dispatch( method, req, res ) {
		
		let auth = null;
		
		///
		/// converts a `METHOD` to `getMethod`
		/// 
		const key = 'on'+ capitalize( method );
		
		///
		const handler = this[ key ];
		
		if( typeof handler == 'function' ) {
			
			handler.call( this, req, res, auth );
			
		} else {
			
			res.replyError( 405, "Method Not Allowed", "The HTTP method "+ request.method +" is not supported for this endpoint." );
			
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
		
		///
		res.replyNoContent();
		
	}
	
}
