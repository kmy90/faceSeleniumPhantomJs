"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
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
        this.router.get('/db', (req, res) => {
            db_1.DBConection.init().then((dbc) => {
                dbc.findCollection('colection', {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.get('/db/:colec', (req, res) => {
            db_1.DBConection.init().then((dbc) => {
                dbc.findCollection(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.get('/db/:colec/drop', (req, res) => {
            db_1.DBConection.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
    }
}
exports.TestRouter = TestRouter;
const testRouter = new TestRouter();
testRouter.init();
exports.default = (testRouter.router);
