"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_conection_1 = require("./database-conection");
const database_config_1 = require("../config/database-config");
const tokens = {};
const TOKEN_COLECTION = 'token';
var timer_token_refresh = null;
class TokensDB {
    constructor() {
    }
    static removeOldToken() {
        database_conection_1.default.init().then((dbc) => {
            let date_expire = Date.now() - database_config_1.default.token_expire_time;
            dbc.removeCollectionMany(TOKEN_COLECTION, { $or: [{ time: { $lte: date_expire } },
                    { time: undefined }] }).then(() => { }, (e) => console.error('TokensDB Remove', e));
            dbc.close();
        });
    }
    static refreshTokensDb() {
        if (database_config_1.default.token_refresh_time > 0 && database_config_1.default.token_expire_time) {
            if (timer_token_refresh)
                TokensDB.removeOldToken();
            timer_token_refresh = setTimeout(TokensDB.refreshTokensDb, database_config_1.default.token_refresh_time);
        }
    }
    static find(query) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findCollectionMany(TOKEN_COLECTION, query).then((tokensDb) => {
                return resolver(tokensDb);
            }, reject);
            dbc.close();
        }, reject));
    }
    static findByToken(key) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findOneUpdate(TOKEN_COLECTION, { token: key }, { time: Date.now() }).then((token) => {
                return resolver(token);
            }, reject);
            dbc.close();
        }, reject));
    }
    static findByUserId(userId) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findOneUpdate(TOKEN_COLECTION, { userId: userId }, { time: Date.now() }).then((tokensDb) => {
                resolver(tokensDb);
            }, reject);
            dbc.close();
        }, reject));
    }
    static getTokenAdmin() {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findOneUpdate(TOKEN_COLECTION, { admin: true }, { time: Date.now() }).then((tokensDb) => {
                resolver(tokensDb);
            }, reject);
            dbc.close();
        }, reject));
    }
    static removeUserToken(userId) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.removeCollectionMany(TOKEN_COLECTION, { userId: userId }).then(resolver, reject);
            dbc.close();
        }, reject));
    }
    static removeAdminToken() {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.removeCollectionMany(TOKEN_COLECTION, { admin: true }).then(resolver, reject);
            dbc.close();
        }, reject));
    }
    static removeAllToken() {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.removeCollectionMany(TOKEN_COLECTION, {}).then(resolver, reject);
            dbc.close();
        }, reject));
    }
    static createAdminToken(token) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, admin: true, time: Date.now() }).then((rest) => {
                resolver(rest.ops[0]);
            }, reject);
            dbc.close();
        }, reject));
    }
    static createUserToken(userId, token) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, userId, time: Date.now() }).then((rest) => {
                resolver(rest.ops[0]);
            }, reject);
            dbc.close();
        }, reject));
    }
}
exports.TokensDB = TokensDB;
TokensDB.refreshTokensDb();
