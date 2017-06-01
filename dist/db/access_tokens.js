"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const db_1 = require("../db");
const config_db_1 = require("./config_db");
const tokens = {};
const TOKEN_COLECTION = 'token';
var timer_token_refresh = null;
class TokenDB {
    constructor() {
    }
    static dorpDB() {
        db_1.DBConection.init().then((dbc) => {
            let date_expire = Date.now() - config_db_1.default.token_expire_time;
            dbc.removeCollectionMany(TOKEN_COLECTION, {}).then(() => { console.log('Drop Token'); }, (e) => { console.error('TokenDB Drop', e); });
            dbc.close();
        });
    }
    static removeOldToken() {
        db_1.DBConection.init().then((dbc) => {
            let date_expire = Date.now() - config_db_1.default.token_expire_time;
            dbc.removeCollectionMany(TOKEN_COLECTION, { $or: [{ time: { $lte: date_expire } },
                    { time: undefined }] }).then(() => { }, (e) => { console.error('TokenDB Remove', e); });
            dbc.close();
        });
    }
    static refreshTokensDb() {
        if (config_db_1.default.token_refresh_time > 0 && config_db_1.default.token_expire_time) {
            if (timer_token_refresh)
                TokenDB.removeOldToken();
            timer_token_refresh = setTimeout(TokenDB.refreshTokensDb, config_db_1.default.token_refresh_time);
        }
    }
    static find(key) {
        return new Promise((resolver, reject) => db_1.DBConection.init().then((dbc) => {
            //Use finde and update time:Date.now()
            dbc.findOneUpdate(TOKEN_COLECTION, { token: key }, { time: Date.now() }).then((tokenDb) => {
                return resolver(tokenDb);
            }, reject);
            dbc.close();
        }, reject));
    }
    static getTokenByClientId(clientId) {
        return new Promise((resolver, reject) => db_1.DBConection.init().then((dbc) => {
            //Use finde and update time:Date.now()
            dbc.findOneUpdate(TOKEN_COLECTION, { clientId: clientId }, { time: Date.now() }).then((tokenDb) => {
                resolver(tokenDb);
            }, reject);
            dbc.close();
        }, reject));
    }
    static removeClientToken(clientId) {
        return new Promise((resolver, reject) => db_1.DBConection.init().then((dbc) => {
            dbc.removeCollectionMany(TOKEN_COLECTION, { clientId: clientId }).then(resolver, reject);
            dbc.close();
        }, reject));
    }
    static createToken(clientId) {
        return new Promise((resolver, reject) => db_1.DBConection.init().then((dbc) => {
            const token = utils_1.Utils.getUid(config_db_1.default.token_size);
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, clientId, time: Date.now() }).then((rest) => {
                resolver(rest.ops[0]);
            }, reject);
            dbc.close();
        }, reject));
    }
}
exports.TokenDB = TokenDB;
TokenDB.refreshTokensDb();
