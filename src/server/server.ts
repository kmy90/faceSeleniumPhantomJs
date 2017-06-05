import * as http from 'http';
import * as debug from 'debug';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';

import RutingServer from '../router';
import AuthenticateService from '../services/authenticate-service';


// Creates and configures an ExpressJS web server.
export class Server {

  // ref to Express instance
  private express: express.Application;
  private static httpServer:any;
  private static instance:Server = null;
  public port:any;


   //Run configuration methods on the Express instance.
  constructor() {
    AuthenticateService.init();
    this.express = express();
    this.middleware();
    this.routes();
    this.buildListeners();
  }

  private buildListeners () : void {
    this.port = Server.normalizePort(process.env.PORT || 5000);
    this.express.set('port', this.port);
    Server.httpServer = http.createServer(this.express);
    Server.httpServer.listen(this.port);
    Server.httpServer.on('error', this.onError);
    Server.httpServer.on('listening', this.onListening);
  }
  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }

  // Configure API endpoints.
  private routes(): void {
    RutingServer.addRutes(this.express);
  }

  private static normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
  }

 private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
    switch(error.code) {
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

  private onListening(): void {
    let addr = Server.httpServer.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }

  public static init():Server {
    if( !Server.instance ) Server.instance = new Server();
    return Server.instance;
  }
}