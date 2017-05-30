"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauthController_1 = require("../controllers/oauthController");
class OauthRouter {
    constructor() {
        this.router = express_1.Router();
        this.controller = new oauthController_1.OauthController();
        this.init();
    }
    init() {
        this.router.post('/token', this.controller.post_create_token);
        this.router.get('/token', this.controller.get_create_token);
    }
}
exports.OauthRouter = OauthRouter;
const oauthRouter = new OauthRouter();
oauthRouter.init();
exports.default = (oauthRouter.router);
