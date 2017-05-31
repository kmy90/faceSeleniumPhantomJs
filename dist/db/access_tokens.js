"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refresTime = (60 * 60 * 1000);
const tokens = {};
class TokenDB {
    constructor() { }
    static removeOldToken(token) {
        return () => {
            tokens[token] = undefined;
            delete tokens[token];
        };
    }
    static refreshToken(token) {
        clearTimeout(token.timer);
        token.timer = setTimeout(this.removeOldToken(token.token), refresTime);
    }
    static find(key, done) {
        if (tokens[key]) {
            this.refreshToken(tokens[key]);
            return done(null, tokens[key]);
        }
        ;
        return done(new Error('Token Not Found'));
    }
    static getTokenByClientId(clientId, done) {
        for (let token in tokens) {
            if (tokens[token] && tokens[token].clientId === clientId) {
                this.refreshToken(tokens[token]);
                return done(null, token);
            }
        }
        return done(new Error('Token Not Found'));
    }
    static save(token, clientId, done) {
        let timer = setTimeout(this.removeOldToken(token), refresTime);
        tokens[token] = { token, clientId, timer };
        done();
    }
}
exports.TokenDB = TokenDB;
