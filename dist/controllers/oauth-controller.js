"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth2orize = require("oauth2orize");
const db_1 = require("../db");
const utils_1 = require("../utils");
const controller_config_1 = require("../config/controller-config");
const RE_USE = 'RE-USE';
const MULT_TOKEN = 'MULTI-TOKE';
const ONLY_LAST = 'ONLY-LAST';
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
        server.serializeClient((client, done) => { console.log(4); done(null, client.id); });
        server.deserializeClient((id, done) => {
            console.log('1');
            db_1.UsersDB.findById(id).then((client) => { return done(null, client); }, (error) => { return done(error); });
        });
        // Grant implicit authorization. The callback takes the `client` requesting
        // authorization, the authenticated `user` granting access, and
        // their response, which contains approved scope, duration, etc. as parsed by
        // the application. The application issues a token, which is bound to these
        // values.
        server.grant(oauth2orize.grant.token((client, user, ares, done) => {
            console.log('3');
            OauthController.creat_new_user_token(client.userName).then((token) => { return done(null, token); }, (error) => { return done(error); });
        }));
        // Exchange the client id and password/secret for an access token. The callback accepts the
        // `client`, which is exchanging the client's id and password/secret from the
        // authorization request for verification. If these values are validated, the
        // application issues an access token on behalf of the client who authorized the code.
        server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
            // Validate the client
            console.log('2');
            OauthController.obtain_user_token_politics(client.userName, client.secret_code).then((token) => {
                if (token)
                    return done(null, false);
                done(null, false);
            }, (error) => { return done(error); });
        }));
    }
    //Create a token for a user
    static creat_new_user_token(user_id) {
        let token = utils_1.Utils.getUid(controller_config_1.default.oauth_token_size);
        return db_1.TokensDB.createUserToken(user_id, token);
    }
    //Create a token to admin
    static create_new_admin_token() {
        let token = utils_1.Utils.getUid(controller_config_1.default.oauth_token_size);
        return db_1.TokensDB.createAdminToken(token);
    }
    //Exist only on token active per user
    static obtain_user_token_ru(user_id) {
        return new Promise((resolve, reject) => {
            db_1.TokensDB.findByUserId(user_id).then((token) => {
                if (!token) {
                    this.creat_new_user_token(user_id).then(resolve, reject);
                }
                else {
                    resolve(token);
                }
            }, reject);
        });
    }
    //Have Multiple valid token per user
    static obtain_user_token_mt(user_id) {
        return this.creat_new_user_token(user_id);
    }
    //Exist only on token active per user
    static obtain_admin_token_ru() {
        return new Promise((resolve, reject) => {
            db_1.TokensDB.getTokenAdmin().then((token) => {
                if (!token) {
                    this.create_new_admin_token().then(resolve, reject);
                }
                else {
                    resolve(token);
                }
            }, reject);
        });
    }
    //Token Politic "MULT_TOKEN": Create a new Token, and not remove older tokens
    static obtain_admin_token_mt() {
        return this.create_new_admin_token();
    }
    //Token Politic "ONLT_LAST": Create a new token fora a user, older are remove
    static obtain_user_token_ol(user_id) {
        return new Promise((resolve, reject) => {
            db_1.TokensDB.removeUserToken(user_id).then(() => { this.creat_new_user_token(user_id).then(resolve, reject); }, reject);
        });
    }
    //Token Politic "ONLT_LAST": Create a new token to admin, older are remove
    static obtain_admin_token_ol() {
        return new Promise((resolve, reject) => {
            db_1.TokensDB.removeAdminToken().then(() => { this.create_new_admin_token().then(resolve, reject); }, reject);
        });
    }
    //Obtain token for a user, used server config politics
    static obtain_user_token_politics(userName, secret_code) {
        return new Promise((resolver, reject) => {
            db_1.UsersDB.findByUserName(userName).then((user) => {
                if (!user || user.secret_code != secret_code)
                    return resolver(null);
                if (controller_config_1.default.oauth_token_crate == RE_USE)
                    return this.obtain_user_token_ru(user._id).then(resolver, reject);
                if (controller_config_1.default.oauth_token_crate == MULT_TOKEN)
                    return this.obtain_user_token_mt(user._id).then(resolver, reject);
                if (controller_config_1.default.oauth_token_crate == ONLY_LAST)
                    return this.obtain_user_token_ol(user._id).then(resolver, reject);
            }, reject);
        });
    }
    //Obtain token to admin, used server config politics
    static obtain_admin_token() {
        if (controller_config_1.default.oauth_token_crate == RE_USE)
            return this.obtain_admin_token_ru();
        if (controller_config_1.default.oauth_token_crate == MULT_TOKEN)
            return this.obtain_admin_token_mt();
        if (controller_config_1.default.oauth_token_crate == ONLY_LAST)
            return this.obtain_admin_token_ol();
        return new Promise((resolve, reject) => {
            reject(new Error('Not Validate Politic'));
        });
    }
    //Return function to response a server obtain user token
    static obtain_user_token_service(userName, secret_code) {
        return (response) => this.obtain_user_token_politics(userName, secret_code).then((token) => {
            if (!token)
                return response.status(401).send(Error('Not validate credential'));
            response.status(201).send(token);
        }, (error) => { return response.status(505).send(error); });
    }
    //Return function to response a server obtain admin token
    static obtain_admin_token_service() {
        return (response) => this.obtain_admin_token().then((token) => response.status(201).send(token), (error) => response.status(505).send(error));
    }
    //Method to server ///**************************
    obtain_user_token(requests, response) {
        let secret_code = requests.body.secret_code;
        let userName = requests.body.userName;
        OauthController.obtain_user_token_service(userName, secret_code)(response);
    }
    clean_user_token(requests, response) {
        let secret_code = requests.body.secret_code;
        let userName = requests.body.userName;
        db_1.UsersDB.findByUserName(userName).then((user) => {
            if (!user || user.secret_code != secret_code) {
                response.status(401).send('Unauthorized');
            }
            else {
                db_1.TokensDB.removeUserToken(user._id).then(() => response.status(204).send(''), (error) => response.status(505).send(error));
            }
        }, (error) => response.status(505).send(error));
    }
    obtain_admin_token(requests, response) {
        /*let admin_pass = requests.body.password || requests.query.pass;
        let admin_name = requests.body.name || requests.query.name;
        console.log(admin_name, admin_pass);
        if(!Utils.validateAdmin(admin_name, admin_pass)) {
          response.status(401).send('Unauthorized');
        } else {*/
        OauthController.obtain_admin_token_service()(response);
        //}
    }
    clean_admin_token(requests, response) {
        /*let admin_pass = requests.body.password || requests.query.pass;
        let admin_name = requests.body.name || requests.query.name;
        console.log(admin_name, admin_pass);
        if(!Utils.validateAdmin(admin_name, admin_pass)) {
          response.status(401).send('Unauthorized');
        } else {*/
        db_1.TokensDB.removeAdminToken().then(() => response.status(204).send(''), (error) => response.status(505).send(error));
        //}
    }
    test_token(request, response) {
        response.status(200).send(request.user);
    }
}
exports.OauthController = OauthController;
exports.default = OauthController;
