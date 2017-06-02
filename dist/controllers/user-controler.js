"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
class UserController {
    constructor() { }
    create_user(requests, response) {
        db_1.UsersDB.create_user(requests.body).then((user) => { response.status(200).send(user); }, (error) => { response.status(505).send(error); });
    }
    delete_user(requests, response) {
    }
    change_user_secret(requests, response) {
    }
    change_user_pass(requests, response) {
    }
    obtain_user_info(requests, response) {
    }
}
exports.UserController = UserController;
