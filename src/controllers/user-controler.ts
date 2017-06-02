import {  UsersDB } from '../db';
import { Utils } from '../utils';

export class UserController {

  constructor() {}

  public create_user(requests, response) {
   UsersDB.create_user(requests.body).then(
     (user) => { response.status(200).send(user); },
     (error) => { response.status(505).send(error); }
   )
  }

  public delete_user(requests, response) {

  }

  public change_user_secret(requests, response) {

  }

  public change_user_pass(requests, response) {

  }

  public obtain_user_info(requests, response) {
    UsersDB.findById(requests.user.id).then(
      (user) => { response.status(200).send(requests.user); },
      (error) => { response.status(505).send(error); }
     );
  }
}