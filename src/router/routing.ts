import FacebookMessageRouter from './facebook-message-router';
import TestRouter from './test-router';
import OauthRouter from './oauth-router';
import DBRouter from './database-router';
import UsersRouter from './users-router';
import UserRouter from './user-router';
import * as passport from 'passport';
import { Application } from 'express';

export class RutingServer{
  public static addRutes(express_server:Application) {
    express_server.use('/facebookMessage', FacebookMessageRouter.getRouter());
    express_server.use('/oauth', OauthRouter.getRouter());
    express_server.use('/db',passport.authenticate('bearer-admin', { session: false }), DBRouter.getRouter());
    express_server.use('/test',passport.authenticate('bearer', { session: false }), TestRouter.getRuter());
    express_server.use('/users',passport.authenticate('bearer-admin', { session: false }),UsersRouter.getRouter());
    express_server.use('/user',passport.authenticate('bearer', { session: false }), UserRouter.getRouter());
  }
}
export default RutingServer;