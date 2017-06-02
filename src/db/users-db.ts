import { Utils } from '../utils';
import { DBConection } from '../db'
import { User, User_DATABASE } from './types';
import ConfigDB from './config_db';

const USER_COLECTION = 'user';

export class UsersDB {

    constructor(){}

    private static obfuscate_user_info(db_client:User_DATABASE):User {
      let { _id, secret_code, user_name } = db_client;
      return { id: _id, secret_code, user_name };
    }
    
    private static obfuscate_users_info(db_clients:User_DATABASE[]):User[] {
      let ret:User[] = [];
      for(let i = 0; i < db_clients.length; i++) {
        ret.push(UsersDB.obfuscate_user_info(db_clients[i]));
      }
      return ret;
    }

    public static findById(id):Promise<User> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollection(USER_COLECTION,{ _id:id }).then((clientsDb) => {
          if(clientsDb.length > 0) 
            return resolve(UsersDB.obfuscate_user_info(clientsDb[0]));
          resolve(null);
        },reject);
        dbc.close();
      },reject));
    }

    public static findById_DB(id:string):Promise<User_DATABASE> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollection(USER_COLECTION,{ _id:id }).then((clientsDb) => {
          if(clientsDb.length > 0) 
            return resolve(clientsDb[0]);
          resolve(null);
        },reject);
        dbc.close();
      },reject));
    }

    public static findByUserName(user_name:string):Promise<User> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollection(USER_COLECTION,{ user_name:user_name }).then((clientsDb) => {
           if (clientsDb.length > 0)
            return resolve(UsersDB.obfuscate_user_info(clientsDb[0]));
          resolve(null);
        },reject);
        dbc.close();
      },reject));
    }

    public static findByUserName_DB(user_name:string):Promise<User_DATABASE> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollection(USER_COLECTION,{ user_name:user_name }).then((clientsDb) => {
           if (clientsDb.length > 0)
            return resolve(clientsDb[0]);
          resolve(null);
        },reject);
        dbc.close();
      },reject));
    }

    public static user_reset_secret(user_id:string) {
       return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.findOneUpdate(USER_COLECTION,
              { _id:user_id },
              { secret_code: Utils.getUid(ConfigDB.user_secert_code_size) }).then((tokenDb) => {
               resolver(tokenDb);
            },reject);
            dbc.close();
      },reject));
    }

    public static update_user(user_id:string, client:User) {
     return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.findOneUpdate(USER_COLECTION,
              { _id:user_id },
              { client }).then((tokenDb) => {
               resolver(tokenDb);
            },reject);
            dbc.close();
      },reject));
    }

    public static create_user(user:any):Promise<User> {
      return new Promise((resolver, reject) => 
      DBConection.init().then((dbc) => {
        let new_user = { 
          password: user.password,
          user_name: user.user_name,
          secret_code: Utils.getUid(ConfigDB.user_secert_code_size)
        }
        dbc.findCollection(USER_COLECTION,{ user_name: user.user_name }).then(
          (users) => {
              if(users.length != 0) return reject('user name used')
              dbc.insertCollectionOne(USER_COLECTION,  new_user).then(
                (rest) => {
              resolver(UsersDB.obfuscate_user_info(rest.ops[0]));
              dbc.close();
              },(e) => { dbc.close(); reject(e);});
          }, (e) => { dbc.close(); reject(e);}
        )
      },reject));
    }

}
