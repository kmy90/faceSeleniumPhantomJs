import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import AuthenticateService from '../auth/authenticateService';
import FacebookMessageRouter from '../router/facebookMessageRouter';
import TestRouter from '../router/testRouter';
import OauthRouter from '../router/oauthRouter';
import DBRouter from '../router/dbRouter';

// Creates and configures an ExpressJS web server.
class Server {

  // ref to Express instance
  public express: express.Application;

   //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    AuthenticateService.init();
    this.routes();
  }
  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    this.express.use('/facebookMessage', FacebookMessageRouter);
    this.express.use('/oauth', OauthRouter);
    this.express.use('/db', DBRouter);
    this.express.use('/test',passport.authenticate('bearer', { session: false }), TestRouter);
    
  }
}
export default new Server().express;
