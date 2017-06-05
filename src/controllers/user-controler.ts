import {  UsersDB } from '../db';
import { Utils } from '../utils';
import { User_DATABASE, User, UserInfo } from '../models';

import Config from '../config/controller-config';

export class UserController {

  constructor() {}

  private obfuscate_user_info_for_owner(db_client:User_DATABASE):User {
    let { _id, secret_code, user_name } = db_client;
    return { id: _id, secret_code, user_name };
  }
    
  private obfuscate_user_info_for_admin(db_client:User_DATABASE):User {
    let { _id, user_name } = db_client;
    return { id: _id, user_name };
  }

  private obfuscate_users_info_for_admin(db_clients:User_DATABASE[]):User[] {
    let ret:User[] = [];
    for(let i = 0; i < db_clients.length; i++) {
      ret.push(this.obfuscate_user_info_for_admin(db_clients[i]));
    }
    return ret;
  }

  public create_user(requests, response) {
   let user:User_DATABASE = {
     user_name: requests.body.user_name,
     password: Utils.encriptPass(requests.body.password),
     secret_code: Utils.getUid(Config.user_secert_code_size)
   }
   UsersDB.create_user(user).then(
     (user) => { response.status(201).send(this.obfuscate_user_info_for_owner(user)); },
     (error) => { response.status(505).send(error); }
   )
  }

  public delete_user(requests, response) {
    let user_id = requests.body.user_id || requests.query.user_id ;
    let userName = requests.body.userName || requests.query.userName;
    if(user_id) {

    } else {
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
    }
  }

  public change_user_secret(requests, response) {
    UsersDB.update_userById(requests.user.id,
      { secret_code: Utils.getUid(Config.user_secert_code_size) }).then(
      (user)=> { response.status(200).send(this.obfuscate_user_info_for_owner(user)); },
      (error) => { response.status(505).send(error); }
     );
  }

  public change_user_pass(requests, response) {
    let user:User_DATABASE = {
      password: Utils.encriptPass(requests.body.password)
    }
    UsersDB.update_userById(requests.user.id,
      { secret_code: Utils.getUid(Config.user_secert_code_size) }).then(
      (user)=> { response.status(200).send(this.obfuscate_user_info_for_owner(user)); },
      (error) => { response.status(505).send(error); }
   );
  }

   public obtain_users_info(requests, response) {
    UsersDB.find({}).then(
      (users) => response.status(200).send(this.obfuscate_users_info_for_admin(users)),
      (error) => response.status(505).send(error)
     );
  }

  public obtain_user_info(requests, response) {
    UsersDB.findById(requests.user.id).then(
      (user) => { response.status(200).send(this.obfuscate_user_info_for_owner(user)); },
      (error) => { response.status(505).send(error); }
     );
  }
}