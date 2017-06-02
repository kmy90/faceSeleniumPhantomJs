"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passport_http_bearer = require("passport-http-bearer");
const db_1 = require("../db");
const BearerStrategy = passport_http_bearer.Strategy;
class AuthenticateService {
    static init() {
        this.BearerStrategyUser();
        this.BearerStrategyAdmin();
    }
    //@TODO: Create a login strategy
    static BearerStrategyUser() {
        passport.use(new BearerStrategy((accessToken, done) => {
            db_1.TokensDB.find(accessToken).then((token) => {
                if (!token)
                    return done(null, false);
                // The request came from a user only since userId is null,
                // therefore the user is passed back instead of a user.
                db_1.UsersDB.findById(token.userId).then((user) => {
                    if (!user)
                        return done(null, false);
                    // To keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes.
                    done(null, { id: user.id }, { scope: '*' });
                }, done);
            }, done);
        }));
    }
    static BearerStrategyAdmin() {
        passport.use('bearer-admin', new BearerStrategy((accessToken, done) => {
            db_1.TokensDB.find(accessToken).then((token) => {
                if (!token || !token.admin)
                    return done(null, false);
                done(null, { admin: true }, { scope: '*' });
            }, done);
        }));
    }
}
exports.AuthenticateService = AuthenticateService;
exports.default = AuthenticateService;