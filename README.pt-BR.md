
# API REST com Node.js

Esse projeto é uma implementação simples de uma API REST com Node.js.

## Exemplo

Cada endpoint deve ser criado como extensão da classe [Endpoint]() e os métodos
devem ser defindos como no script a seguir.

Cada metodo recebe como argumento um [RequestHelper]() e um [ResponseHelper](),
que irão auxiliar nas operações de obter os dados da requisição e construir uma resposta adequada.

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

Após o servidor ser iniciado, adicione uma instância do [Endpoint]() criado ao serviço.

```javascript

import REST from './source/index.mjs'

const service = new REST.Service( '127.0.0.1', 80 );

/// é recomendado adicionar um Endpoint definido como padrão
/// que irá direcionar a requisição caso não indentifique `path` da requisição
const isDefault = true;

/// inciando o Endpoint
const helloWroldEndpoint = new HelloWorldEndpoint( '/api/{name}', isDefault );

/// adiciona o endpoint ao serviço
service.append( helloWroldEndpoint );

```

É possivel iniciar o servidor HTTPS informando o certificado SSL e chave privada.

```javascript
const privateKey = fs.readFileSync('./private.key').toString();
const certificate = fs.readFileSync('./certificate.cer').toString();

const rest = new REST.Service( 'demo.alpha', 443, certificate, privateKey );
```

### Authentication 

A `Authentication` pode ser obtida com os métodos `getBasicAuth()`, `getBearerAuth()` e `getJWTAuth()` do [RequestHelper]() - somente se informado no HEAD da requisição Http.

No exemplo a seguir, obtem o JsonWebToken (`req.getJWTAuth()`) e verfica a assinatura com uma chave padrão HMAC.
Se a verificação falhar, será respondido um erro com o código 401 (Unauthorized).

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
