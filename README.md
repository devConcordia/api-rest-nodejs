
# REST Server with Node.js


Para configurar o servidor, é preciso criar as classes que irão manipular as requisições para cada `path`.

```javascript

class MyEndpoint extends Endpoint {
	
	onGet( req, res ) {
		
		let [ polls, id ] = req.getPathData();
		
		/// response a OK, 200 http request
		res.replyJson(200, {
			/// response data
		});
		
	}
	
	onPost( req, res ) {
		
		/// response a CREATED, 201 http request
		res.replyJson(201, {
			/// response data
		});
		
	}
	
//	onPut( req, res ) { }
	
//	onPatch( req, res ) { }
	
//	onDelete( req, res ) { }
	
}


```

Então, inciamos o servidor:

```javascript

let rest = new RestServer( '127.0.0.1' );
	rest.append( new MyEndpoint( '/mye/{id}' ) );

```
