
import RestServer from '../../../source/RestServer.mjs';

import { Polls, Vote, Results } from './core.mjs';

/** 

7. **Sistema de Votação ou Enquetes**  
   - **Funcionalidades**: Criar enquetes e permitir aos usuários votar.  
   - **Exemplo de endpoint**:  
     - `GET /polls` - Obtém lista de e quetes
     - `POST /polls` - Cria uma nova enquete.  
     - `GET /polls/{id}` - Obtém dados de uma votação de uma enquete específica.  
     - `POST /polls/{id}/vote` - Registra um voto na enquete.  
     - `GET /polls/{id}/results` - Obtém os resultados de uma enquete.  

*/

// 
//let privateKey = fs.readFileSync('./setup/private.key').toString(),
//	certificate = fs.readFileSync('./setup/certificate.cer').toString();


//let rest = new RestServer('', certificate, privateKey );

let rest = new RestServer();
	rest.append( new Polls( '/polls/{id}' ) );
	rest.append( new Vote( '/polls/{id}/vote' ) );
	rest.append( new Results( '/polls/{id}/results' ) );


	
