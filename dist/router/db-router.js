"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
class DBRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.get('/:colec', (req, res) => {
            db_1.DBConection.init().then((dbc) => {
                dbc.findCollection(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.post('/:colec', (req, res) => {
            db_1.DBConection.init().then((dbc) => {
                dbc.insertCollectionOne(req.params.colec, req.body).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.get('/:colec/drop', (req, res) => {
            db_1.DBConection.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
    }
}
exports.DBRouter = DBRouter;
const dbRouter = new DBRouter();
dbRouter.init();
exports.default = (dbRouter.router);
