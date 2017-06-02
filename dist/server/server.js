"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const debug = require("debug");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const router_1 = require("../router");
const authenticate_service_1 = require("../services/authenticate-service");
// Creates and configures an ExpressJS web server.
class Server {
    //Run configuration methods on the Express instance.
    constructor() {
        authenticate_service_1.default.init();
        this.express = express();
        this.middleware();
        this.routes();
        this.buildListeners();
    }
    buildListeners() {
        this.port = Server.normalizePort(process.env.PORT || 5000);
        this.express.set('port', this.port);
        Server.httpServer = http.createServer(this.express);
        Server.httpServer.listen(this.port);
        Server.httpServer.on('error', this.onError);
        Server.httpServer.on('listening', this.onListening);
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
    }
    // Configure API endpoints.
    routes() {
        router_1.default.addRutes(this.express);
    }
    static normalizePort(val) {
        let port = (typeof val === 'string') ? parseInt(val, 10) : val;
        if (isNaN(port))
            return val;
        else if (port >= 0)
            return port;
        else
            return false;
    }
    onError(error) {
        if (error.syscall !== 'listen')
            throw error;
        let bind = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    onListening() {
        let addr = Server.httpServer.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        debug(`Listening on ${bind}`);
    }
    static init() {
        if (!Server.instance)
            Server.instance = new Server();
        return Server.instance;
    }
}
Server.instance = null;
exports.Server = Server;
