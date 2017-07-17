import FacebookMessageRouter from './facebook-message-router';
import TestRouter from './test-router';
import OauthRouter from './oauth-router';
import DBRouter from './database-router';
import UsersRouter from './users-router';
import UserRouter from './user-router';
import CreateUserRouter from './create-user-router';

import Config from '../config/service-config'
import * as passport from 'passport';;
import { Application } from 'express';

export class RutingServer{
  public static addRutes(express_server:Application) {
    let API =  Config.api_version;
    console.log(API);
    
    //default TimeOut Routes 45 seconds:
    express_server.use(function(req, res, next){
    res.setTimeout(45000, function(){
        res.status(408).send("Request has timed out")});
        next();
    });
    
    //Developer Services
    express_server.use('/'+API+'/test', TestRouter.getRuter());
    express_server.use('/'+API+'/sandbox/selenium/', FacebookMessageRouter.getRouter());

    //Normal Services
    express_server.use('/'+API+'/selenium/',passport.authenticate(['bearer', 'bearer-admin'], { session: false }), FacebookMessageRouter.getRouter());
    express_server.use('/'+API+'/oauth', OauthRouter.getRouter());
    express_server.use('/'+API+'/db',passport.authenticate('bearer-admin', { session: false }), DBRouter.getRouter());
    express_server.use('/'+API+'/users',passport.authenticate('bearer-admin', { session: false }),UsersRouter.getRouter());
    express_server.use('/'+API+'/user', passport.authenticate('basic',{ session: false }), UserRouter.getRouter());
    express_server.use('/'+API+'/createUser', CreateUserRouter.getRouter());
  }
}
export default RutingServer;