import FacebookMessageRouter from './facebook-message-router';
import TestRouter from './test-router';
import OauthRouter from './oauth-router';
import DBRouter from './database-router';
import UsersRouter from './users-router';
import UserRouter from './user-router';
import CreateUserRouter from './create-user-router';

import * as passport from 'passport';
import { Application } from 'express';

export class RutingServer{
  public static addRutes(express_server:Application) {
    //Develper Services
    express_server.use('/test', TestRouter.getRuter());
    express_server.use('/sandbox/facebookMessage', FacebookMessageRouter.getRouter());
    //Normal Services
    express_server.use('/facebookMessage',passport.authenticate(['bearer', 'bearer-admin'], { session: false }), FacebookMessageRouter.getRouter());
    express_server.use('/oauth', OauthRouter.getRouter());
    express_server.use('/db',passport.authenticate('bearer-admin', { session: false }), DBRouter.getRouter());
    express_server.use('/users',passport.authenticate('bearer-admin', { session: false }),UsersRouter.getRouter());
    express_server.use('/user', passport.authenticate('basic',{ session: false }), UserRouter.getRouter());
    express_server.use('/createUser', CreateUserRouter.getRouter());
  }
}
export default RutingServer;