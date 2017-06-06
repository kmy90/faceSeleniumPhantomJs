"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_controller_1 = require("../controllers/oauth-controller");
const passport = require("passport");
class OauthRouter {
    constructor() {
        this.router = express_1.Router();
        this.controller = new oauth_controller_1.OauthController();
        this.init();
    }
    init() {
        this.router.delete('/token', this.controller.clean_user_token);
        this.router.post('/token', this.controller.obtain_user_token);
        //this.router.post('/token/admin',this.controller.obtain_admin_token);
        this.router.get('/token/test', passport.authenticate(['bearer', 'bearer-admin'], { session: false }), this.controller.test_token);
        this.router.get('/token/admin', passport.authenticate('basic-admin', { session: false }), this.controller.obtain_admin_token);
        this.router.delete('/token/admin', passport.authenticate('basic-admin', { session: false }), this.controller.clean_admin_token);
    }
    static getRouter() {
        const oauthRouter = new OauthRouter();
        oauthRouter.init();
        return (oauthRouter.router);
    }
}
exports.OauthRouter = OauthRouter;
exports.default = OauthRouter;
