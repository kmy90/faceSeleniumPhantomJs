import { Utils } from '../utils';
import { DBConection } from '../db'
import ConfigDB from './config_db';

const tokens = {};
const TOKEN_COLECTION = 'token';
var timer_token_refresh = null;

export class TokenDB {

    constructor() {
    }

    public static dorpDB() {
        DBConection.init().then((dbc) => {
            let date_expire = Date.now() - ConfigDB.token_expire_time;
            dbc.removeCollectionMany(TOKEN_COLECTION,{}).then(()=>{console.log('Drop Token');},(e)=>{ console.error('TokenDB Drop', e);});
            dbc.close();
        });
    }

    static removeOldToken() {
   
        DBConection.init().then((dbc) => {
            let date_expire = Date.now() - ConfigDB.token_expire_time;
            dbc.removeCollectionMany( TOKEN_COLECTION,
                { $or:[ {time: { $lte:date_expire }},
                { time: undefined} ] }).then(()=>{},(e)=>{ console.error('TokenDB Remove', e);});
            dbc.close();
        });
    }

    static refreshTokensDb():void {
        if(ConfigDB.token_refresh_time > 0 && ConfigDB.token_expire_time ) {
           if(timer_token_refresh) TokenDB.removeOldToken();
           timer_token_refresh = setTimeout(TokenDB.refreshTokensDb,ConfigDB.token_refresh_time);
        }
    }

    public static find(key, done):any {
        DBConection.init().then((dbc) => {
            dbc.findCollection(TOKEN_COLECTION,{ token:key }).then((tokensDb) => {
              console.log(tokensDb);
              for (let i = 0, len = tokensDb.length; i < len; i++) {
                if (tokensDb[i].token === key) return done(null, tokensDb[i]);
              }
              done(null,null);
            },done);
            dbc.close();
      },done);
    }

    public static getTokenByClientId( clientId, done):any {
        DBConection.init().then((dbc) => {
            dbc.findCollection(TOKEN_COLECTION,{ clientId:clientId }).then((tokensDb) => {
              for (let i = 0, len = tokensDb.length; i < len; i++) {
                //this.refreshTokensDb(tokens[key]); 
                if (tokensDb[i].clientId === clientId) return done(null, tokensDb[i]);
              }
              done(null,null);
            },done);
            dbc.close();
      },done);
    }

    public static createToken(clientId, done):any {

        DBConection.init().then((dbc) =>{
            const token = Utils.getUid(ConfigDB.token_size);
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, clientId, time:Date.now() }).then(
                (rest) => {
                    console.log(rest.ops[0]);
                    done(null, rest.ops[0]);
                },done)
            dbc.close();

        },done);

    }
}

TokenDB.refreshTokensDb(); 

