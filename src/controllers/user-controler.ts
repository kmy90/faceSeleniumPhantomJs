import { Response } from 'express';
import { UsersDB, TokensDB } from '../db';
import { Utils } from '../utils';
import { User_DATABASE, User, UserInfo } from '../models';

import Config from '../config/controller-config';

export class UserController {

  constructor() {}

  //Remove sensitive user info to owner user
  private static obfuscate_user_info_for_owner(db_client:User_DATABASE):User {
    let { _id, secret_code, user_name } = db_client;
    return { id: _id, secret_code, user_name };
  }
    
  //Remove sensitive user info to admin
  private static obfuscate_user_info_for_admin(db_client:User_DATABASE):User {
    let { _id, user_name } = db_client;
    return { id: _id, user_name };
  }

  //Remove sensitive user info to admin, for user list
  private static obfuscate_users_info_for_admin(db_clients:User_DATABASE[]):User[] {
    let ret:User[] = [];
    for(let i = 0; i < db_clients.length; i++) {
      ret.push(this.obfuscate_user_info_for_admin(db_clients[i]));
    }
    return ret;
  }

  // Method Service //*************************
  public create_user(requests:any, response:Response) {
   if(!requests.body.user_name || !requests.body.password) {
     response.status(505).send('Need "user_name" and "password" params');
   } else {
     let user:User_DATABASE = {
       user_name: requests.body.user_name,
       password: Utils.encriptPass(requests.body.password),
       secret_code: Utils.getUid(Config.user_secert_code_size)
     }
     UsersDB.create_user(user).then(
       (user) => { response.status(201).send(UserController.obfuscate_user_info_for_owner(user)); },
       (error) => { response.status(505).send(error); }
     )
   }
  }

  public delete_user(requests:any, response:Response) {
    let user_id = requests.body.user_id || requests.query.user_id ;
    let userName = requests.body.userName || requests.query.userName;
    if(user_id) {
      console.log(user_id);
      UsersDB.delete_userById(user_id).then(
        (ret) => { console.log(ret); response.status(204).send(ret); },
        (error) => response.status(505).send(error)
      );
    } else if(userName) {
      UsersDB.findByUserName(userName).then(
        (user)=>{
          if(!user) return response.status(204).send('');
          UsersDB.delete_userById(user._id).then(
            () => response.status(204).send('') ,
            (error) => response.status(505).send(error)
          )
        },
        (error) => response.status(505).send(error)
      );
    } else {
      response.status(204).send('');
    }
  }

  public change_user_secret(requests:any, response:Response) {
    UsersDB.update_userById(requests.user.id,
      { secret_code: Utils.getUid(Config.user_secert_code_size) }).then(
        (user)=> { 
          response.status(200).send(UserController.obfuscate_user_info_for_owner(user));
          TokensDB.removeUserToken(requests.user.id).catch((e) => console.error(e));
        },
        (error) => response.status(505).send(error)
     );
  }

  public change_user_pass(requests:any, response:Response):void {
    if(!requests.body.password) {
      response.status(505).send('Need params "password"');
    } else {
      let user:User_DATABASE = {
        password: Utils.encriptPass(requests.body.password)
      }
      UsersDB.update_userById(requests.user.id, user).then(
        (user_update)=> { 
          response.status(200).send(UserController.obfuscate_user_info_for_owner(user_update));
          TokensDB.removeUserToken(requests.user.id).catch((e) => console.error(e));
        },
        (error) => response.status(505).send(error)
      );
    }
  }

  public obtain_users_info(requests:any, response:Response):void {
    UsersDB.find({}).then(
      (users) => response.status(200).send(UserController.obfuscate_users_info_for_admin(users)),
      (error) => response.status(505).send(error)
     );
  }

  public obtain_user_info(requests:any, response:Response) {
    UsersDB.findById(requests.user.id).then(
      (user) => { response.status(200).send(UserController.obfuscate_user_info_for_owner(user)); },
      (error) => { response.status(505).send(error); }
     );
  }
}