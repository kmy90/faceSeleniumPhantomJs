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
                dbc.findCollectionMany(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.post('/:colec', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.insertCollectionMay(req.params.colec, req.body).then((e) => res.status(201).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.post('/:colec/one', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.insertCollectionMay(req.params.colec, req.body).then((e) => res.status(201).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.delete('/:colec', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec, {}).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.post('/:colec/querry', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.findCollectionMany(req.params.colec, req.body).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.delete('/:colec/querry', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec, req.body).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.put('/:colec/querry', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                if (!req.body.querry) {
                    res.status(505).send('Need Params "querry" and "new"');
                }
                else {
                    dbc.updateCollectionMany(req.params.colec, req.body.querry, req.body.new).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                }
                dbc.close();
            });
        });
        this.router.post('/:colec/querry/one', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.findCollectionOne(req.params.colec, req.body).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.delete('/:colec/querry/one', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                dbc.removeCollectionOne(req.params.colec, req.body).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                dbc.close();
            });
        });
        this.router.put('/:colec/querry/one', (req, res) => {
            database_conection_1.default.init().then((dbc) => {
                if (!req.body.querry) {
                    res.status(505).send('Need Params "querry" and "new"');
                }
                else {
                    dbc.updateCollectionOne(req.params.colec, req.body.querry, req.body.new).then((e) => res.status(200).send(e), (e) => res.status(505).send(e));
                }
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
