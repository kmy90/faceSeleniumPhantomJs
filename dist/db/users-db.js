"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_conection_1 = require("./database-conection");
const USER_COLECTION = 'user';
class UsersDB {
    constructor() { }
    static findById(id) {
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
                    return resolve(clientsDb[0]);
                resolve(null);
            }, reject);
            dbc.close();
        }, reject));
    }
    static update_user(user_id, user) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            dbc.findOneUpdate(USER_COLECTION, { _id: user_id }, user).then((user) => resolver(user), reject);
            dbc.close();
        }, reject));
    }
    static create_user(user) {
        return new Promise((resolver, reject) => database_conection_1.default.init().then((dbc) => {
            let new_user = {
                password: user.password,
                user_name: user.user_name,
                secret_code: user.secret_code
            };
            dbc.findCollection(USER_COLECTION, { user_name: user.user_name }).then((users) => {
                if (users.length != 0)
                    return reject('user name used');
                dbc.insertCollectionOne(USER_COLECTION, new_user).then((rest) => {
                    resolver(rest.ops[0]);
                    dbc.close();
                }, (e) => { dbc.close(); reject(e); });
            }, (e) => { dbc.close(); reject(e); });
        }, reject));
    }
}
exports.UsersDB = UsersDB;
