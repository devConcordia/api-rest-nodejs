
# REST Server with Node.js

Esse projeto é um estudo de uma API REST com Node.js.

## Exemplo basico

### Configuração do Servidor

Para configurar o servidor, é preciso criar as classes que irão manipular as requisições para cada `path`,
e cada metodo da requisição no *Endpoint*.

```javascript

class MyEndpoint extends Endpoint {
	
	onGet( req, res ) {
		
		let { id } = req.getPathData();
		
		/// response a OK, 200 http request
		res.replyJson(200, {
			/// response data
		});
		
	}
	
//	onPost( req, res ) { }

//	onPut( req, res ) { }
	
//	onPatch( req, res ) { }
	
//	onDelete( req, res ) { }
	
}


```

Então, inciamos o servidor (se informado o certificado SSL e chave privada, o servidor será https):

```javascript

const privateKey = fs.readFileSync('...').toString();
const certificate = fs.readFileSync('...').toString();

const rest = new RestServer( 'demo.alpha', certificate, privateKey );
      rest.append( new MyEndpoint( '/api/{id}' ) );

```

### Authentication - JsonWebToken 

Para autenticar o usuario, precisamos adiconar uma verificação.
No exemplo a seguir, o metodo `verifyAuth` verifica o token no header da requisição HTTP é valido.
A verificação é com HMAC. Caso a verificação falhe, a requisição é encerrada com o codigo 401 (Unauthorized).

```javascript

const KEY_HMAC = "...";


function verifyAuth( req, res ) {
		
	let auth = req.getJWTAuth();
	
	if( auth && auth.verifySign( KEY_HMAC ) )
		return auth;
	
	res.replyError( 401, "Unauthorized", "The request require authentication" );
	
}

```

E então podemos utilizar em uma requisição:

```javascript

class MyEndpoint extends Endpoint {
	
	...
	
	onPost( req, res ) {
		
		let auth = verifyAuth( req, res );
		
		...
		
	}

}

```
