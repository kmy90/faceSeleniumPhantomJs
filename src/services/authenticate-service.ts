import * as passport from 'passport';
import * as passport_http_bearer from 'passport-http-bearer';
//import * as  passport_local from 'passport-local';
//import *  as passport_http from 'passport-http';

import { TokensDB, UsersDB } from '../db';

//const BasicStrategy = passport_http.BasicStrategy;
//const LocalStrategy = passport_local.Strategy;
const BearerStrategy = passport_http_bearer.Strategy;

export class AuthenticateService {
  
  public static init():void {
    this.BearerStrategyUser();
    this.BearerStrategyAdmin();
  }


/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
  /*public static LocalStrategy() {
    passport.use(new LocalStrategy(
      (username, password, done) => {
        db.users.findByUsername(username, (error, user) => {
          if (error) return done(error);
          if (!user) return done(null, false);
          if (user.password !== password) return done(null, false);
          return done(null, user);
        });
      }
    ));
  }*/
  //@TODO: Create a login strategy

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
            done(null, { id:user.id }, { scope: '*' });
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