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

    public static find(key):Promise<any> {
        return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            //Use finde and update time:Date.now()
            dbc.findCollectionUpdate(TOKEN_COLECTION,{ token:key },{ time:Date.now() }).then((tokensDb) => {
              if ( tokensDb.length > 0 ) return resolver(tokensDb[0]);
              resolver(null);
            },reject);
            dbc.close();
        },reject));
    }

    public static getTokenByClientId( clientId):Promise<any> {
        return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            //Use finde and update time:Date.now()
            dbc.findCollectionUpdate(TOKEN_COLECTION,{ clientId:clientId }, { time:Date.now() }).then((tokensDb) => {
               if ( tokensDb.length > 0 ) return resolver(tokensDb[0]);
              resolver(null);
            },reject);
            dbc.close();
      },reject));
    }

    static removeClientToken(clientId):Promise<any> {
        return new Promise((resolver, reject) =>
            DBConection.init().then((dbc) => {
                dbc.removeCollectionMany( TOKEN_COLECTION, 
                    {clientId:clientId}).then(resolver, reject);
                dbc.close();
            },reject));
    }

    public static createToken(clientId):Promise<any> {
        return new Promise((resolver, reject)=>
        DBConection.init().then((dbc) =>{
            const token = Utils.getUid(ConfigDB.token_size);
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, clientId, time:Date.now() }).then(
                (rest) => {
                    resolver(rest.ops[0]);
                },reject)
            dbc.close();
        },reject));

    }
}

TokenDB.refreshTokensDb(); 

