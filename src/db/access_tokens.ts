const refresTime = (60*60*1000);
const tokens = {};

export class TokenDB {

    constructor() {}

    static removeOldToken(token):any {
        return () => {
            tokens[token]= undefined;
            delete tokens[token];
        }
    }

    static refreshToken(token):void {
        clearTimeout(token.timer);
        token.timer = setTimeout(this.removeOldToken(token.token), refresTime);
    }

    public static find(key, done):any {
        if (tokens[key]) {this.refreshToken(tokens[key]); return done(null, tokens[key]);};
        return done(new Error('Token Not Found'));
    }

    public static getTokenByClientId( clientId, done):any {
        for (let token in tokens) {
            if (tokens[token] && tokens[token].clientId === clientId) {
                this.refreshToken(tokens[token]);
                return done(null, token);
            }
        }
        return done(new Error('Token Not Found'));
    }

    public static save(token, clientId, done):void {
        let timer = setTimeout(this.removeOldToken(token), refresTime);
        tokens[token] = { token, clientId, timer };
        done();
    }
}
