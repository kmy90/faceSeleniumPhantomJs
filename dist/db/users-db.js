"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const database_conection_1 = require("./database-conection");
const database_config_1 = require("../config/database-config");
const USER_COLECTION = 'user';
class UsersDB {
    constructor() { }
    static obfuscate_user_info(db_client) {
        let { _id, secret_code, user_name } = db_client;
        return { id: _id, secret_code, user_name };
    }
    static obfuscate_users_info(db_clients) {
        let ret = [];
        for (let i = 0; i < db_clients.length; i++) {
            ret.push(UsersDB.obfuscate_user_info(db_clients[i]));
        }
        return ret;
    }
    static findById(id) {
        return new Promise((resolve, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findCollection(USER_COLECTION, { _id: id }).then((clientsDb) => {
                if (clientsDb.length > 0)
                    return resolve(UsersDB.obfuscate_user_info(clientsDb[0]));
                resolve(null);
            }, reject);
            dbc.close();
        }, reject));
    }
    static findById_DB(id) {
        return new Promise((resolve, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findCollection(USER_COLECTION, { _id: id }).then((clientsDb) => {
                if (clientsDb.length > 0)
                    return resolve(clientsDb[0]);
                resolve(null);
            }, reject);
            dbc.close();
        }, reject));
    }
    static findByUserName(user_name) {
        return new Promise((resolve, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findCollection(USER_COLECTION, { user_name: user_name }).then((clientsDb) => {
                if (clientsDb.length > 0)
                    return resolve(UsersDB.obfuscate_user_info(clientsDb[0]));
                resolve(null);
            }, reject);
            dbc.close();
        }, reject));
    }
    static findByUserName_DB(user_name) {
        return new Promise((resolve, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findCollection(USER_COLECTION, { user_name: user_name }).then((clientsDb) => {
                if (clientsDb.length > 0)
                    return resolve(clientsDb[0]);
                resolve(null);
            }, reject);
            dbc.close();
        }, reject));
    }
    static user_reset_secret(user_id) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findOneUpdate(USER_COLECTION, { _id: user_id }, { secret_code: utils_1.Utils.getUid(database_config_1.default.user_secert_code_size) }).then((tokenDb) => {
                resolver(tokenDb);
            }, reject);
            dbc.close();
        }, reject));
    }
    static update_user(user_id, client) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findOneUpdate(USER_COLECTION, { _id: user_id }, { client }).then((tokenDb) => {
                resolver(tokenDb);
            }, reject);
            dbc.close();
        }, reject));
    }
    static create_user(user) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            let new_user = {
                password: user.password,
                user_name: user.user_name,
                secret_code: utils_1.Utils.getUid(database_config_1.default.user_secert_code_size)
            };
            dbc.findCollection(USER_COLECTION, { user_name: user.user_name }).then((users) => {
                if (users.length != 0)
                    return reject('user name used');
                dbc.insertCollectionOne(USER_COLECTION, new_user).then((rest) => {
                    resolver(UsersDB.obfuscate_user_info(rest.ops[0]));
                    dbc.close();
                }, (e) => { dbc.close(); reject(e); });
            }, (e) => { dbc.close(); reject(e); });
        }, reject));
    }
}
exports.UsersDB = UsersDB;
