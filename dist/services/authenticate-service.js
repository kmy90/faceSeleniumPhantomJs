"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passport_http_bearer = require("passport-http-bearer");
//import * as  passport_local from 'passport-local';
//import *  as passport_http from 'passport-http';
const db_1 = require("../db");
//const BasicStrategy = passport_http.BasicStrategy;
//const LocalStrategy = passport_local.Strategy;
const BearerStrategy = passport_http_bearer.Strategy;
class AuthenticateService {
    static init() {
        this.BearerStrategyUser();
        this.BearerStrategyAdmin();
    }
    /**
     * LocalStrategy
     *
     * This strategy is used to authenticate users based on a username and password.
     * Anytime a request is made to authorize an application, we must ensure that
     * a user is logged in before asking them to approve the request.
     */
    /*public static LocalStrategy() {
      passport.use(new LocalStrategy(
        (username, password, done) => {
          db.users.findByUsername(username, (error, user) => {
            if (error) return done(error);
            if (!user) return done(null, false);
            if (user.password !== password) return done(null, false);
            return done(null, user);
          });
        }
      ));
    }*/
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
