"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth2orize = require("oauth2orize");
const db_1 = require("../db");
class OauthController {
    constructor() {
        this.init();
    }
    init() {
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
            db_1.ClienatDB.findById(id).then((client) => { return done(null, client); }, (error) => { return done(error); });
        });
        // Grant implicit authorization. The callback takes the `client` requesting
        // authorization, the authenticated `user` granting access, and
        // their response, which contains approved scope, duration, etc. as parsed by
        // the application. The application issues a token, which is bound to these
        // values.
        server.grant(oauth2orize.grant.token((client, user, ares, done) => {
            db_1.TokenDB.createToken(client.clientId, (error, token) => {
                if (error)
                    return done(error);
                return done(null, token);
            });
        }));
        // Exchange the client id and password/secret for an access token. The callback accepts the
        // `client`, which is exchanging the client's id and password/secret from the
        // authorization request for verification. If these values are validated, the
        // application issues an access token on behalf of the client who authorized the code.
        server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
            // Validate the client
            db_1.ClienatDB.findByClientId(client.clientId).then((localClient) => {
                if (!localClient)
                    return done(null, false);
                if (localClient.clientSecret !== client.clientSecret)
                    return done(null, false);
                // Everything validated, return the token
                // Pass in a null for user id since there is no user with this grant type
                db_1.TokenDB.createToken(client.clientId, (error, token) => {
                    if (error)
                        return done(error);
                    return done(null, token);
                });
            }, (e) => { return done(e); });
        }));
    }
    static create_token(clientId, clientSecert) {
        return (requests, response) => {
            db_1.ClienatDB.findByClientId(clientId).then((client) => {
                if (client.clientSecret != clientSecert)
                    return response.status(401).send(Error('Client Secert Not Match'));
                db_1.TokenDB.getTokenByClientId(clientId, (error, token) => {
                    if (error)
                        return response.status(505).send(error);
                    if (!token) {
                        db_1.TokenDB.createToken(clientId, (error, token_new) => {
                            response.status(201).send(token_new);
                        });
                    }
                    else {
                        response.status(201).send(token);
                    }
                });
            }, (error) => { return response.status(505).send(error); });
        };
    }
    post_create_token(requests, response) {
        let clientSecert = requests.body.clientSecert;
        let clientId = requests.body.clientId;
        OauthController.create_token(clientId, clientSecert)(requests, response);
    }
    get_create_token(requests, response) {
        let clientSecert = requests.query.clientSecert;
        let clientId = requests.query.clientId;
        OauthController.create_token(clientId, clientSecert)(requests, response);
    }
}
exports.OauthController = OauthController;
