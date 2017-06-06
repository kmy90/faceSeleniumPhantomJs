import { Utils } from '../utils';
import DBConection from './database-conection';
import { Token } from '../models';
import ConfigDB from '../config/database-config';

const tokens = {};
const TOKEN_COLECTION = 'token';
var timer_token_refresh = null;

export class TokensDB {

    constructor() {
    }

    private static removeOldToken():void {
        DBConection.init().then((dbc) => {
            let date_expire = Date.now() - ConfigDB.token_expire_time;
            dbc.removeCollectionMany( TOKEN_COLECTION,
                { $or:[ {time: { $lte:date_expire }},
                { time: undefined} ] }).then(()=>{},
                (e)=> console.error('TokensDB Remove', e)
            );
            dbc.close();
        });
    }

    static refreshTokensDb():void {
        if(ConfigDB.token_refresh_time > 0 && ConfigDB.token_expire_time ) {
           if(timer_token_refresh) TokensDB.removeOldToken();
           timer_token_refresh = setTimeout(TokensDB.refreshTokensDb,ConfigDB.token_refresh_time);
        }
    }

    public static find(query:any):Promise<Token[]> {
        return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.findCollectionMany(TOKEN_COLECTION, query).then((tokensDb) => {
              return resolver(tokensDb);
            },reject);
            dbc.close();
        },reject));
    }

    public static findByToken(key:string):Promise<Token> {
        return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.findOneUpdate(TOKEN_COLECTION,{ token:key },{ time:Date.now() }).then((token) => {
              return resolver(token);
            },reject);
            dbc.close();
        },reject));
    }

    public static findByUserId(userId:string):Promise<Token> {
        return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.findOneUpdate(TOKEN_COLECTION, { userId:userId }, { time:Date.now() }).then((tokensDb) => {
               resolver(tokensDb);
            },reject);
            dbc.close();
      },reject));
    }

    public static getTokenAdmin():Promise<Token> {
        return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.findOneUpdate(TOKEN_COLECTION,{ admin:true }, { time:Date.now() }).then((tokensDb) => {
               resolver(tokensDb);
            },reject);
            dbc.close();
      },reject));
    }

    public static removeUserToken(userId:string):Promise<Token> {
        return new Promise((resolver, reject) =>
            DBConection.init().then((dbc) => {
                dbc.removeCollectionMany( TOKEN_COLECTION, 
                    {userId:userId}).then(resolver, reject);
                dbc.close();
            },reject));
    }


    public static removeAdminToken():Promise<Token> {
        return new Promise((resolver, reject) =>
            DBConection.init().then((dbc) => {
                dbc.removeCollectionMany( TOKEN_COLECTION, 
                    {admin:true}).then(resolver, reject);
                dbc.close();
            },reject));
    }

    public static removeAllToken():Promise<Token> {
        return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.removeCollectionMany( TOKEN_COLECTION, 
                {}).then(resolver, reject);
            dbc.close();
        },reject));
    }

    public static createAdminToken(token:string):Promise<Token> {
        return new Promise((resolver, reject)=>
        DBConection.init().then((dbc) =>{
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, admin:true, time:Date.now() }).then(
                (rest) => {
                    resolver(rest.ops[0]);
                },reject)
            dbc.close();
        },reject));
    }

    public static createUserToken(userId:string, token:string):Promise<Token> {
        return new Promise((resolver, reject)=>
        DBConection.init().then((dbc) =>{
            dbc.insertCollectionOne(TOKEN_COLECTION, { token, userId, time:Date.now() }).then(
                (rest) => {
                    resolver(rest.ops[0]);
                },reject)
            dbc.close();
        },reject));
    }
}

TokensDB.refreshTokensDb(); 