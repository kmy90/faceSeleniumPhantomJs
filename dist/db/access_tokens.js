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
    static find(key, done) {
        db_1.DBConection.init().then((dbc) => {
            dbc.findCollection(TOKEN_COLECTION, { token: key }).then((tokensDb) => {
                console.log(tokensDb);
                for (let i = 0, len = tokensDb.length; i < len; i++) {
                    if (tokensDb[i].token === key)
                        return done(null, tokensDb[i]);
                }
                done(null, null);
            }, done);
            dbc.close();
        }, done);
    }
    static getTokenByClientId(clientId, done) {
        db_1.DBConection.init().then((dbc) => {
            dbc.findCollection(TOKEN_COLECTION, { clientId: clientId }).then((tokensDb) => {
                for (let i = 0, len = tokensDb.length; i < len; i++) {
                    //this.refreshTokensDb(tokens[key]); 
                    if (tokensDb[i].clientId === clientId)
                        return done(null, tokensDb[i]);
                }
                done(null, null);
            }, done);
            dbc.close();
        }, done);
    }
    static createToken(clientId, done) {
        db_1.DBConection.init().then((dbc) => {
            const token = utils_1.Utils.getUid(config_db_1.default.token_size);
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, clientId, time: Date.now() }).then((rest) => {
                console.log(rest.ops[0]);
                done(null, rest.ops[0]);
            }, done);
            dbc.close();
        }, done);
    }
}
exports.TokenDB = TokenDB;
TokenDB.refreshTokensDb();
