"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facebook_message_router_1 = require("./facebook-message-router");
const test_router_1 = require("./test-router");
const oauth_router_1 = require("./oauth-router");
const database_router_1 = require("./database-router");
const users_router_1 = require("./users-router");
const user_router_1 = require("./user-router");
const create_user_router_1 = require("./create-user-router");
const service_config_1 = require("../config/service-config");
const passport = require("passport");
;
class RutingServer {
    static addRutes(express_server) {
        let API = service_config_1.default.api_version;
        console.log(API);
        //default TimeOut Routes 45 seconds:
        express_server.use(function (req, res, next) {
            res.setTimeout(45000, function () {
                res.status(408).send("Request has timed out");
            });
            next();
        });
        //Developer Services
        express_server.use('/' + API + '/test', test_router_1.default.getRuter());
        express_server.use('/' + API + '/sandbox/selenium/', facebook_message_router_1.default.getRouter());
        //Normal Services
        express_server.use('/' + API + '/selenium/', passport.authenticate(['bearer', 'bearer-admin'], { session: false }), facebook_message_router_1.default.getRouter());
        express_server.use('/' + API + '/oauth', oauth_router_1.default.getRouter());
        express_server.use('/' + API + '/db', passport.authenticate('bearer-admin', { session: false }), database_router_1.default.getRouter());
        express_server.use('/' + API + '/users', passport.authenticate('bearer-admin', { session: false }), users_router_1.default.getRouter());
        express_server.use('/' + API + '/user', passport.authenticate('basic', { session: false }), user_router_1.default.getRouter());
        express_server.use('/' + API + '/createUser', create_user_router_1.default.getRouter());
    }
}
exports.RutingServer = RutingServer;
exports.default = RutingServer;
