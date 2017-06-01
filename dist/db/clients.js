"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const CLIENT_COLECTION = 'client';
class ClienatDB {
    constructor() { }
    static findById(id) {
        return new Promise((resolve, reject) => db_1.DBConection.init().then((dbc) => {
            dbc.findCollection(CLIENT_COLECTION, { id: id }).then((clientsDb) => {
                for (let i = 0, len = clientsDb.length; i < len; i++) {
                    if (clientsDb[i].id === id)
                        return resolve(clientsDb[i]);
                }
                resolve(null);
            }, reject);
        }, reject));
    }
    static findByClientId(clientId) {
        return new Promise((resolve, reject) => db_1.DBConection.init().then((dbc) => {
            dbc.findCollection(CLIENT_COLECTION, { clientId: clientId }).then((clientsDb) => {
                for (let i = 0, len = clientsDb.length; i < len; i++) {
                    if (clientsDb[i].clientId === clientId)
                        return resolve(clientsDb[i]);
                }
                resolve(null);
            }, reject);
        }, reject));
    }
}
exports.ClienatDB = ClienatDB;
