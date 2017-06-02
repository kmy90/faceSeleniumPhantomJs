"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_conection_1 = require("../db/database-conection");
class DataBaseRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.get('/:colec', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.findCollection(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.post('/:colec', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.insertCollectionOne(req.params.colec, req.body).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.get('/:colec/drop', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
    }
    static getRouter() {
        const dbRouter = new DataBaseRouter();
        dbRouter.init();
        return (dbRouter.router);
    }
}
exports.DataBaseRouter = DataBaseRouter;
exports.default = DataBaseRouter;
