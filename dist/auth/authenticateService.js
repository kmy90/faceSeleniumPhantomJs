"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passport_http_bearer = require("passport-http-bearer");
const db_1 = require("../db");
const BearerStrategy = passport_http_bearer.Strategy;
class AuthenticateService {
    static init() {
        this.BearerStrategy();
    }
    static BearerStrategy() {
        passport.use(new BearerStrategy((accessToken, done) => {
            db_1.TokenDB.find(accessToken, (error, token) => {
                if (error)
                    return done(error);
                if (!token)
                    return done(null, false);
                // The request came from a client only since userId is null,
                // therefore the client is passed back instead of a user.
                db_1.ClienatDB.findByClientId(token.clientId).then((client) => {
                    if (!client)
                        return done(null, false);
                    // To keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes.
                    done(null, client, { scope: '*' });
                }, done);
            });
        }));
    }
}
exports.default = AuthenticateService;
