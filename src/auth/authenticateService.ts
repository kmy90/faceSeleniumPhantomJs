import * as passport from 'passport';
import * as passport_http_bearer from 'passport-http-bearer';
import { TokensDB, UsersDB } from '../db';

const BearerStrategy = passport_http_bearer.Strategy;

export default class AuthenticateService {
  

  public static init():void {
    this.BearerStrategyUser();
    this.BearerStrategyAdmin();
  }

  public static BearerStrategyUser():void {
     passport.use(
        new BearerStrategy((accessToken, done) => {
        TokensDB.find(accessToken).then((token) => {
          if (!token) return done(null, false);
          // The request came from a client only since userId is null,
          // therefore the client is passed back instead of a user.
          UsersDB.findById(token.userId).then( (client) => {
            if (!client) return done(null, false);
            // To keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes.
            done(null, client, { scope: '*' });
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
            done(null, true, { scope: '*' });
        },done);
      })
    );
  }
}