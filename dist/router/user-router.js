"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controler_1 = require("../controllers/user-controler");
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        this.controller = new user_controler_1.UserController();
        this.init();
    }
    init() {
        this.router.get('/', this.controller.obtain_user_info);
    }
    static getRouter() {
        const userRouter = new UserRouter();
        userRouter.init();
        return (userRouter.router);
    }
}
exports.UserRouter = UserRouter;
exports.default = UserRouter;
