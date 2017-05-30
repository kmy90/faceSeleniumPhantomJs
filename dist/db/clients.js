"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_db_mock_1 = require("./dbmock/client-db-mock");
class ClienatDB {
    constructor() { }
    static findById(id, done) {
        for (let i = 0, len = client_db_mock_1.default.length; i < len; i++) {
            if (client_db_mock_1.default[i].id === id)
                return done(null, client_db_mock_1.default[i]);
        }
        return done(new Error('Client Not Found'));
    }
    static findByClientId(clientId, done) {
        for (let i = 0, len = client_db_mock_1.default.length; i < len; i++) {
            if (client_db_mock_1.default[i].clientId === clientId)
                return done(null, client_db_mock_1.default[i]);
        }
        return done(new Error('Client Not Found'));
    }
}
exports.ClienatDB = ClienatDB;
