import * as passport from 'passport';
import * as passport_http_bearer from 'passport-http-bearer';
import *  as passport_http from 'passport-http';
import Config from '../config/service-config';

import { Utils } from '../utils';
import { TokensDB, UsersDB } from '../db';

const BasicStrategy = passport_http.BasicStrategy;
const BearerStrategy = passport_http_bearer.Strategy;
const ADMIN_ID = 'ADMIN_ID';

export class AuthenticateService {
  
  public static init():void {
    this.BearerStrategyUser();
    this.BearerStrategyAdmin();
    this.BasicUser();
    this.BasicAdmin();

    passport.serializeUser((user, done) =>  done(null, user.id));
    passport.deserializeUser((id, done) => {
      if(id === ADMIN_ID) return done(null , { admin: true });
      UsersDB.findById(id).then( 
        (user) => done(null, user),
        (error) => done(error)
      );
    });
  }

  private static BasicUser() {
    passport.use(new BasicStrategy((username, pass, done) => {
     UsersDB.findByUserName(username).then((user)=>{
       if(!user) return done(null, false);
       if(!Utils.validatePass(pass, user.password)) done(null, false);
       done(null, { id:user._id });
     }, done);
    }));
  }

  private static BasicAdmin() {
    passport.use('basic-admin', new BasicStrategy((name, pass, done) => {
      if(name !== Config.admin_name) return done(null, false);
      if(pass !== Config.admin_pass) return done(null, false);
      done(null, { id:ADMIN_ID, admin:true });
    }));
  }





  public static BearerStrategyUser():void {
     passport.use(
        new BearerStrategy((accessToken, done) => {
        TokensDB.find(accessToken).then((token) => {
          if (!token) return done(null, false);
          // The request came from a user only since userId is null,
          // therefore the user is passed back instead of a user.
          UsersDB.findById(token.userId).then( (user) => {
            if (!user) return done(null, false);
            // To keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes.
            done(null, { id:user._id }, { scope: '*' });
          }, done);
        },done);
      })
    );
  }

  public static BearerStrategyAdmin():void {
     passport.use('bearer-admin',
        new BearerStrategy((accessToken, done) => {
        TokensDB.find(accessToken).then((token) => {
          if (!token || !token.admin) return done(null, false);
            done(null, { admin: true }, { scope: '*' });
        },done);
      })
    );
  }
}
export default AuthenticateService;