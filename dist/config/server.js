"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const authenticateService_1 = require("../auth/authenticateService");
const facebookMessageRouter_1 = require("../router/facebookMessageRouter");
const testRouter_1 = require("../router/testRouter");
const oauthRouter_1 = require("../router/oauthRouter");
// Creates and configures an ExpressJS web server.
class Server {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        authenticateService_1.default.init();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
    routes() {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        this.express.use('/facebookMessage', facebookMessageRouter_1.default);
        this.express.use('/oauth', oauthRouter_1.default);
        this.express.use('/test', testRouter_1.default);
    }
}
exports.default = new Server().express;
