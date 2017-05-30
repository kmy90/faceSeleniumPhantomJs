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
		  ClienatDB.findById(id, (error, client) => {
		    if (error) return done(error);
		    return done(null, client);
		  });
		});


		// Grant implicit authorization. The callback takes the `client` requesting
		// authorization, the authenticated `user` granting access, and
		// their response, which contains approved scope, duration, etc. as parsed by
		// the application. The application issues a token, which is bound to these
		// values.

		server.grant(oauth2orize.grant.token((client:any, user:any, ares:any, done:any) => {
		  const token = Utils.getUid(256);
		  TokenDB.save(token, client.clientId, (error) => {
		    if (error) return done(error);
		    return done(null, token);
		  });
		}));

		// Exchange the client id and password/secret for an access token. The callback accepts the
		// `client`, which is exchanging the client's id and password/secret from the
		// authorization request for verification. If these values are validated, the
		// application issues an access token on behalf of the client who authorized the code.

		server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
		  // Validate the client
		  ClienatDB.findByClientId(client.clientId, (error, localClient) => {
		    if (error) return done(error);
		    if (!localClient) return done(null, false);
		    if (localClient.clientSecret !== client.clientSecret) return done(null, false);
		    // Everything validated, return the token
		    const token = Utils.getUid(256);
		    // Pass in a null for user id since there is no user with this grant type
		    TokenDB.save(token, client.clientId, (error) => {
		      if (error) return done(error);
		      return done(null, token);
		    });
		  });
		}));
	}

  private static create_token(clientId, clientSecert) {
    return (requests, response) => {
     ClienatDB.findByClientId(clientId, (error, client) => {
        if(error) throw error;
        if(client.clientSecret != clientSecert) throw new Error('Client Not Found');
        TokenDB.getTokenByClientId(clientId, (error, token) => {
            console.log(token)
            if(!token) {
                token = Utils.getUid(16);
                TokenDB.save(token, clientId, (error) => {
                    //if (error) return done(error);
                    response.status(201).send(token);
                });
            } else {
                response.status(201).send(token);
            }
        });
    });
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
