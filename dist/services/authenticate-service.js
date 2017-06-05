"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passport_http_bearer = require("passport-http-bearer");
const passport_http = require("passport-http");
const service_config_1 = require("../config/service-config");
const utils_1 = require("../utils");
const db_1 = require("../db");
const BasicStrategy = passport_http.BasicStrategy;
const BearerStrategy = passport_http_bearer.Strategy;
const ADMIN_ID = 'ADMIN_ID';
class AuthenticateService {
    static init() {
        this.BearerStrategyUser();
        this.BearerStrategyAdmin();
        this.BasicUser();
        this.BasicAdmin();
        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => {
            if (id === ADMIN_ID)
                return done(null, { admin: true });
            db_1.UsersDB.findById(id).then((user) => done(null, user), (error) => done(error));
        });
    }
    static BasicUser() {
        passport.use(new BasicStrategy((username, pass, done) => {
            db_1.UsersDB.findByUserName(username).then((user) => {
                if (!user)
                    return done(null, false);
                if (!utils_1.Utils.validatePass(pass, user.password))
                    done(null, false);
                done(null, { id: user._id });
            }, done);
        }));
    }
    static BasicAdmin() {
        passport.use('basic-admin', new BasicStrategy((name, pass, done) => {
            if (name !== service_config_1.default.admin_name)
                return done(null, false);
            if (pass !== service_config_1.default.admin_pass)
                return done(null, false);
            done(null, { id: ADMIN_ID, admin: true });
        }));
    }
    static BearerStrategyUser() {
        passport.use(new BearerStrategy((accessToken, done) => {
            db_1.TokensDB.findByToken(accessToken).then((token) => {
                if (!token)
                    return done(null, false);
                // The request came from a user only since userId is null,
                // therefore the user is passed back instead of a user.
                db_1.UsersDB.findById(token.userId).then((user) => {
                    if (!user)
                        return done(null, false);
                    // To keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes.
                    done(null, { id: user._id }, { scope: '*' });
                }, done);
            }, done);
        }));
    }
    static BearerStrategyAdmin() {
        passport.use('bearer-admin', new BearerStrategy((accessToken, done) => {
            db_1.TokensDB.findByToken(accessToken).then((token) => {
                if (!token || !token.admin)
                    return done(null, false);
                done(null, { admin: true }, { scope: '*' });
            }, done);
        }));
    }
}
exports.AuthenticateService = AuthenticateService;
exports.default = AuthenticateService;
