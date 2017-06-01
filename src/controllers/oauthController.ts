import * as oauth2orize from 'oauth2orize';
import passport from 'passport';
import { TokenDB, ClienatDB } from '../db';
import { Utils } from '../utils';

export class OauthController {

	constructor() {
    this.init();
	}

	public init() {
		// Create OAuth 2.0 server
		let server = oauth2orize.createServer();

		// Register serialialization and deserialization functions.
		//
		// When a client redirects a user to user authorization endpoint, an
		// authorization transaction is initiated. To complete the transaction, the
		// user must authenticate and approve the authorization request. Because this
		// may involve multiple HTTP request/response exchanges, the transaction is
		// stored in the session.
		//
		// An application must supply serialization functions, which determine how the
		// client object is serialized into the session. Typically this will be a
		// simple matter of serializing the client's ID, and deserializing by finding
		// the client by ID from the database.

		server.serializeClient((client, done) => done(null, client.id));
		server.deserializeClient((id, done) => {
		  ClienatDB.findById(id).then(
        (client) => { return done(null, client); },
        (error) => { return done(error); }
        );
		});


		// Grant implicit authorization. The callback takes the `client` requesting
		// authorization, the authenticated `user` granting access, and
		// their response, which contains approved scope, duration, etc. as parsed by
		// the application. The application issues a token, which is bound to these
		// values.

		server.grant(oauth2orize.grant.token((client:any, user:any, ares:any, done:any) => {
		  TokenDB.createToken(client.clientId).then( 
        (token) => { return done(null, token); },
        (error) => { return done(error); }
		  );
		}));

		// Exchange the client id and password/secret for an access token. The callback accepts the
		// `client`, which is exchanging the client's id and password/secret from the
		// authorization request for verification. If these values are validated, the
		// application issues an access token on behalf of the client who authorized the code.

		server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
		  // Validate the client
		  ClienatDB.findByClientId(client.clientId).then(
        (localClient) => {
  		    if (!localClient) return done(null, false);
  		    if (localClient.clientSecret !== client.clientSecret) return done(null, false);
  		    // Everything validated, return the token
  		    // Pass in a null for user id since there is no user with this grant type
  		    TokenDB.createToken(client.clientId).then( 
            (token) => { return done(null, token); },
            (error) => { return done(error); }
          );
		    },
        (e) => { return done(e); } 
      );
		}));
	}

  private static create_token(clientId, clientSecert) {
    return (requests, response) => {
     ClienatDB.findByClientId(clientId).then(
      (client) => {
        if(client.clientSecret != clientSecert) return response.status(401).send(Error('Client Secert Not Match'));
        TokenDB.getTokenByClientId(clientId).then((token) => {
            if(!token) {
                TokenDB.createToken(clientId).then( 
                  (token_new) => { response.status(201).send(token_new); },
                  (error) => { return response.status(505).send(error); }
                );
            } else {
                response.status(201).send(token);
            }
        },
        (error) => { return response.status(505).send(error); }
        );
      },
      (error) => { return response.status(505).send(error); }
    );
   }
  }

	public post_create_token(requests, response) {
    let clientSecert = requests.body.clientSecert;
    let clientId = requests.body.clientId;
    OauthController.create_token(clientId, clientSecert)(requests, response);
	}

  public get_create_token(requests, response) {
    let clientSecert =  requests.query.clientSecert;
    let clientId = requests.query.clientId;
    OauthController.create_token(clientId, clientSecert)(requests, response);
  }
}
