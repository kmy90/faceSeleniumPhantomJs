import * as passport from 'passport';
import * as passport_http_bearer from 'passport-http-bearer';
import { TokenDB, ClienatDB } from '../db';
const BearerStrategy = passport_http_bearer.Strategy;

export default class AuthenticateService {
  

  public static init():void {
    this.BearerStrategy();
  }

  public static BearerStrategy():void {
     passport.use(
      new BearerStrategy((accessToken, done) => {
       TokenDB.find(accessToken, (error, token) => {
         if (error) return done(error);
         if (!token) return done(null, false);
      // The request came from a client only since userId is null,
      // therefore the client is passed back instead of a user.
          ClienatDB.findByClientId(token.clientId, (error, client) => {
            if (error) return done(error);
            if (!client) return done(null, false);
            // To keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes.
            done(null, client, { scope: '*' });
          });
        });
      })
    );
  }

}