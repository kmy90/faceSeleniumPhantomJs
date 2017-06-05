import DBConection from './database-conection';
import { User_DATABASE } from '../models';
import ConfigDB from '../config/database-config';

const USER_COLECTION = 'user';

export class UsersDB {

    constructor(){}

    public static findById(id):Promise<User_DATABASE> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollectionOne(USER_COLECTION,{ _id:id }).then((clientDb) => {
          resolve(clientDb);
        },reject);
        dbc.close();
      },reject));
    }

    public static find(query:any):Promise<User_DATABASE[]> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollectionMany(USER_COLECTION, query).then((clientsDb) => {
          resolve(clientsDb);
        },reject);
        dbc.close();
      },reject));
    }

    public static findByUserName(user_name:string):Promise<User_DATABASE> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollectionOne(USER_COLECTION,{ user_name:user_name }).then((clientDb) => {
          resolve(clientDb);
        },reject);
        dbc.close();
      },reject));
    }

    public static update_userById(user_id:string, user:User_DATABASE) {
     return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.findOneUpdate(USER_COLECTION,
              { _id:user_id },
              user ).then((user) => resolver(user), reject);
            dbc.close();
      },reject));
    }

    public static update_users(querry:any, user:User_DATABASE) {
     return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.updateCollectionMany(USER_COLECTION,
              querry,
              user).then((res) => resolver(res), reject);
            dbc.close();
      },reject));
    }

    public static delete_userById(user_id:string) {
     return new Promise((resolver, reject) =>
        DBConection.init().then((dbc) => {
            dbc.removeCollectionOne(USER_COLECTION,{ _id: user_id }).then((user) => resolver(user), reject);
            dbc.close();
      },reject));
    }


    public static create_user(user:User_DATABASE):Promise<User_DATABASE> {
      return new Promise((resolver, reject) => 
      DBConection.init().then((dbc) => {
        let new_user:User_DATABASE = { 
          password: user.password,
          user_name: user.user_name,
          secret_code: user.secret_code
        }
        dbc.findCollectionMany(USER_COLECTION,{ user_name: user.user_name }).then(
          (users) => {
              if(users.length != 0) return reject('user name used')
              dbc.insertCollectionOne(USER_COLECTION,  new_user).then(
                (rest) => { 
                  resolver(rest.ops[0]);
                  dbc.close();
                },(e) => { dbc.close(); reject(e);});
          }, (e) => { dbc.close(); reject(e);}
        )
      },reject));
    }

}
