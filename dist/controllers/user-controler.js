"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const utils_1 = require("../utils");
const controller_config_1 = require("../config/controller-config");
class UserController {
    constructor() { }
    obfuscate_user_info_for_owner(db_client) {
        let { _id, secret_code, user_name } = db_client;
        return { id: _id, secret_code, user_name };
    }
    obfuscate_user_info_for_admin(db_client) {
        let { _id, user_name } = db_client;
        return { id: _id, user_name };
    }
    obfuscate_users_info_for_admin(db_clients) {
        let ret = [];
        for (let i = 0; i < db_clients.length; i++) {
            ret.push(this.obfuscate_user_info_for_admin(db_clients[i]));
        }
        return ret;
    }
    create_user(requests, response) {
        let user = {
            user_name: requests.body.user_name,
            password: utils_1.Utils.encriptPass(requests.body.password),
            secret_code: utils_1.Utils.getUid(controller_config_1.default.user_secert_code_size)
        };
        db_1.UsersDB.create_user(user).then((user) => { response.status(201).send(this.obfuscate_user_info_for_owner(user)); }, (error) => { response.status(505).send(error); });
    }
    delete_user(requests, response) {
        let user_id = requests.body.user_id || requests.query.user_id;
        let userName = requests.body.userName || requests.query.userName;
        if (user_id) {
        }
        else {
            db_1.UsersDB.findByUserName(userName).then((user) => {
                if (!user)
                    return response.status(204).send('');
                db_1.UsersDB.delete_userById(user._id).then(() => response.status(204).send(''), (error) => response.status(505).send(error));
            }, (error) => response.status(505).send(error));
        }
    }
    change_user_secret(requests, response) {
        db_1.UsersDB.update_userById(requests.user.id, { secret_code: utils_1.Utils.getUid(controller_config_1.default.user_secert_code_size) }).then((user) => { response.status(200).send(this.obfuscate_user_info_for_owner(user)); }, (error) => { response.status(505).send(error); });
    }
    change_user_pass(requests, response) {
        let user = {
            password: utils_1.Utils.encriptPass(requests.body.password)
        };
        db_1.UsersDB.update_userById(requests.user.id, { secret_code: utils_1.Utils.getUid(controller_config_1.default.user_secert_code_size) }).then((user) => { response.status(200).send(this.obfuscate_user_info_for_owner(user)); }, (error) => { response.status(505).send(error); });
    }
    obtain_users_info(requests, response) {
        db_1.UsersDB.find({}).then((users) => response.status(200).send(this.obfuscate_users_info_for_admin(users)), (error) => response.status(505).send(error));
    }
    obtain_user_info(requests, response) {
        db_1.UsersDB.findById(requests.user.id).then((user) => { response.status(200).send(this.obfuscate_user_info_for_owner(user)); }, (error) => { response.status(505).send(error); });
    }
}
exports.UserController = UserController;
