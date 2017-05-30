"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facebookMessageController_1 = require("../controllers/facebookMessageController");
class FacebookMessageRouter {
    constructor() {
        this.router = express_1.Router();
        this.controller = new facebookMessageController_1.FacebookMessageController();
        this.init();
    }
    init() {
        this.router.post('/send', this.controller.sendAutomatedMessage);
    }
}
exports.FacebookMessageRouter = FacebookMessageRouter;
const facebookMessageRouter = new FacebookMessageRouter();
facebookMessageRouter.init();
exports.default = (facebookMessageRouter.router);
