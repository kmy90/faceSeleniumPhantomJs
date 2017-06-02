"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class TestRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.post('/post', (req, res) => {
            res.status(200).send('OK');
        });
        this.router.get('/get', (req, res) => {
            res.status(200).send('OK');
        });
    }
}
exports.TestRouter = TestRouter;
const testRouter = new TestRouter();
testRouter.init();
exports.default = (testRouter.router);
