"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_controller_1 = require("../controllers/oauth-controller");
class OauthRouter {
    constructor() {
        this.router = express_1.Router();
        this.controller = new oauth_controller_1.OauthController();
        this.init();
    }
    init() {
        this.router.post('/token', this.controller.post_obtain_user_token);
        this.router.get('/token', this.controller.get_obtain_user_token);
        this.router.post('/token/admin', this.controller.post_obtain_admin_token);
        this.router.get('/token/admin', this.controller.get_obtain_admin_token);
    }
    static getRouter() {
        const oauthRouter = new OauthRouter();
        oauthRouter.init();
        return (oauthRouter.router);
    }
}
exports.OauthRouter = OauthRouter;
exports.default = OauthRouter;
