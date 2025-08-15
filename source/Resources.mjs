
import fs from 'fs';
import Endpoint from '../Endpoint.mjs';

/// small reference to file content-types
/// @ref https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const MIME_TYPE_TABLE = {
	'bmp': 'image/bmp',
	'css': 'text/css',
	'csv': 'text/csv',
	'htm': 'text/html',
	'html': 'text/html',
	'ico': 'image/x-icon',
	'glsl': 'text/plain',
	'gif': 'image/gif',
	'jpe': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'js': 'application/x-javascript',
	'json': 'application/json',
	'mjs': 'application/x-javascript',
	'mp3': 'audio/mpeg3',
	'ogg': 'audio/ogg',
	'pdf': 'application/pdf',
	'png': 'image/png',
	'svg': 'image/svg+xml',
	'text': 'text/plain',
	'tgz': 'application/x-compressed',
	'ttf': 'font/ttf',
	'tif': 'image/tiff',
	'tiff': 'image/tiff',
	'wasm': 'application/wasm',
	'wav': 'audio/wav', // 'audio/x-wav',
	'weba': 'audio/webm',
	'webm': 'video/webm',
	'webp': 'image/webp',
	'xml': 'application/xml', // 'text/xml',
	'zip': 'application/x-compressed'
};

/** getContentType
 *	
 *	@param {String} input
 *	@param {Boolean} charsetUtf8
 */
function getContentType( string, charsetUtf8 = false ) {
	
	let output = 'application/octet-stream';
	let extent = string.split('.').pop();
	
	if( extent in MIME_TYPE_TABLE ) 
		output = MIME_TYPE_TABLE[ extent ];
	
	if( charsetUtf8 )
		output += '; charset=UTF-8';
	
	return output;
	
}

/** scandir
 *	
 */
function scandir( path ) {
	
	let items = fs.readdirSync( path );
	
	let folders = [];
	let files = [];
	
	let data = null;
	
	for( let src of items ) {
	
		if( fs.lstatSync( path +'/'+ src ).isFile() ) {
			
			files.push( src );
			
		} else {
			
			folders.push( src );
			
		}
		
	}
	
	return { folders, files };

}

/** getDirectoryHtmlPage
 *	
 */
function getDirectoryHtmlPage( path, localPath ) {
	
	let { folders, files } = scandir( path );
	
	let url = path.replace( localPath, '' );
	let bodyContent = '<ul>'; 
		bodyContent += '<li><a href="../">../</a></li>';
		bodyContent += folders.map(e=>'<li><a href="'+ url +'/'+ e +'">'+ e +'</a></li>').join('');
		bodyContent += files.map(e=>'<li><a href="'+ url +'/'+ e +'">'+ e +'</a></li>').join('');
		bodyContent += '</ul>';
	
	return `<!DOCTYPE html>
<html>
    <head>
		<meta charset='UTF-8' />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="format-detection" content="telephone=yes" />
		<title>localhost</title>
	</head>
	<body>`+ bodyContent +`</body>
</html>`

}


/** Resources
 *	
 */
export default class Resources extends Endpoint {
	
	isDefault = true;
	
	constructor( endpoint, path ) {
		
		super( endpoint );
		
		this.localPath = path;
		
	}
	
	onGet( req, res ) {
		
		let path = req.getURL().replace(/^\//, this.localPath);
		
		/// reply no content
		if( path.includes('favicon.ico') )
			return res.replyNoContent();
		
		try { 
			
			let stats = fs.statSync( path ); 
			
			if( stats.isDirectory() ) {
				
				let content = getDirectoryHtmlPage( path, this.localPath );
				
				res.reply( 200, "text/html", content );
				
			} else {
				
				let type = getContentType( path );
				
				res.replyFile( 200, type, path, stats );
				
			}
			
		} catch(e) {
			
			res.replyError(404, "Not Found", e.message);
			
		}
		
	}
	
}
