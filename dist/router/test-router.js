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
    static getRuter() {
        const testRouter = new TestRouter();
        testRouter.init();
        return testRouter.router;
    }
}
exports.TestRouter = TestRouter;
exports.default = TestRouter;
