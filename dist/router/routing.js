"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facebook_message_router_1 = require("./facebook-message-router");
const test_router_1 = require("./test-router");
const oauth_router_1 = require("./oauth-router");
const database_router_1 = require("./database-router");
const users_router_1 = require("./users-router");
const user_router_1 = require("./user-router");
const create_user_router_1 = require("./create-user-router");
const passport = require("passport");
class RutingServer {
    static addRutes(express_server) {
        //Develper Services
        express_server.use('/test', test_router_1.default.getRuter());
        express_server.use('/sandbox/facebookMessage', facebook_message_router_1.default.getRouter());
        //Normal Services
        express_server.use('/facebookMessage', passport.authenticate(['bearer', 'bearer-admin'], { session: false }), facebook_message_router_1.default.getRouter());
        express_server.use('/oauth', oauth_router_1.default.getRouter());
        express_server.use('/db', passport.authenticate('bearer-admin', { session: false }), database_router_1.default.getRouter());
        express_server.use('/users', passport.authenticate('bearer-admin', { session: false }), users_router_1.default.getRouter());
        express_server.use('/user', passport.authenticate('basic', { session: false }), user_router_1.default.getRouter());
        express_server.use('/createUser', create_user_router_1.default.getRouter());
    }
}
exports.RutingServer = RutingServer;
exports.default = RutingServer;
