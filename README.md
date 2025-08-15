
# API REST with Node.js

This project is a simple implementation of a REST API with Node.js.

## Example

Each endpoint must be created as an extension of the [Endpoint]() class, and the methods must be defined as shown in the following script.

Each method receives a [RequestHelper]() and [ResponseHelper]() as arguments, which help retrieve request data and construct an appropriate response.

```javascript

import REST from './source/index.mjs'

class HelloWorldEndpoint extends REST.Endpoint {
    
    /** GET
     *    
     *  @param {RequestHelper} req
     *  @param {ResponseHelper} res
     */
    onGet( req, res ) {
        
        let { name } = req.getPathData();
        
        /// response a OK, 200 http request
        res.replyJson(200, { message: 'Hello '+ name });
        
    }
    
    /** POST
     *    
     *  @param {RequestHelper} req
     *  @param {ResponseHelper} res
     */
    onPost( req, res ) {
        
        let { name } = req.getPathData();
        
        let data = req.getBodyData();
        
        /// response a OK, 200 http request
        res.replyJson(200, { message: name +' has uload a data' });
        
    }
    
//    onPut( req, res ) { }
//    onPatch( req, res ) { }
//    onDelete( req, res ) { }

}

```

<!-- Após o servidor ser iniciado, adicione uma instância do [Endpoint]() criado ao serviço. -->
After the server has started, add an instance of the created [Endpoint]() to the service.

```javascript

import REST from './source/index.mjs'

/// start server
const service = new REST.Service( '127.0.0.1', 80 );

/// add a Endpoint defined was default is recommended
const isDefault = true;

/// create a Endpoint instance
const helloWroldEndpoint = new HelloWorldEndpoint( '/api/{name}', isDefault );

/// add endpoint to service
service.append( helloWroldEndpoint );

```

To start a HTTPS server, providing the SSL certificate and private key when create a [RestServer]().

```javascript
const privateKey = fs.readFileSync('./private.key').toString();
const certificate = fs.readFileSync('./certificate.cer').toString();

const rest = new REST.Service( 'demo.alpha', 443, certificate, privateKey );
```

### Authentication 

The `Authentication` can be obtained using the `getBasicAuth()`, `getBearerAuth()` e `getJWTAuth()` methods from [RequestHelper]() - only if provided in the HTTP request headers.

In the following example, try obtain a JsonWebToken (`req.getJWTAuth()`) and the signature is verified using a default HMAC key.
If the verification fails, an error with the 401 (Unauthorized) code will be responded.

```javascript

const KEY_HMAC = "...";

class ExampleEndpoint extends Endpoint {
    
    onPost( req, res ) {
    
        let auth = req.getJWTAuth();
        
        if( auth && auth.verifySign( KEY_HMAC ) ) {
            
            /// authenticated
            
        } else {
            
            res.replyError( 401, "Unauthorized", "The request require authentication" );
            
        }
        
    }

}

```
