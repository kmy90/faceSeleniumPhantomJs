"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facebook_message_controller_1 = require("../controllers/facebook-message-controller");
class FacebookMessageRouter {
    constructor() {
        this.router = express_1.Router();
        this.controller = new facebook_message_controller_1.default();
        this.init();
    }
    init() {
        this.router.post('/task', this.controller.sendAutomatedMessage);
    }
    static getRouter() {
        const facebookMessageRouter = new FacebookMessageRouter();
        facebookMessageRouter.init();
        return (facebookMessageRouter.router);
    }
}
exports.FacebookMessageRouter = FacebookMessageRouter;
exports.default = FacebookMessageRouter;
