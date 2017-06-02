"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controler_1 = require("../controllers/user-controler");
class UsersRouter {
    constructor() {
        this.router = express_1.Router();
        this.controller = new user_controler_1.UserController();
        this.init();
    }
    init() {
        this.router.post('/', this.controller.create_user);
    }
    static getRouter() {
        const usersRouter = new UsersRouter();
        usersRouter.init();
        return (usersRouter.router);
    }
}
exports.UsersRouter = UsersRouter;
exports.default = UsersRouter;
