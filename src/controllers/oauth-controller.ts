import * as oauth2orize from 'oauth2orize';
import passport from 'passport';
import { TokensDB, UsersDB } from '../db';
import { Utils } from '../utils';
import Config from '../config/controller-config';
import ConfigServis from '../config/service-config';
import { Token, User } from '../models';

const RE_USE = 'RE-USE';
const MULT_TOKEN = 'MULTI-TOKE';
const ONLY_LAST = 'ONLY-LAST';

export class OauthController {

	constructor() {
    this.init();
	}

	public init() {
		// Create OAuth 2.0 server
		let server = oauth2orize.createServer();

		// Register serialialization and deserialization functions.
		//
		// When a client redirects a user to user authorization endpoint, an
		// authorization transaction is initiated. To complete the transaction, the
		// user must authenticate and approve the authorization request. Because this
		// may involve multiple HTTP request/response exchanges, the transaction is
		// stored in the session.
		//
		// An application must supply serialization functions, which determine how the
		// client object is serialized into the session. Typically this will be a
		// simple matter of serializing the client's ID, and deserializing by finding
		// the client by ID from the database.

		server.serializeClient((client, done) => {console.log(4);done(null, client.id)});
		server.deserializeClient((id, done) => {
      console.log('1');
		  UsersDB.findById(id).then(
        (client) => { return done(null, client); },
        (error) => { return done(error); }
        );
		});


		// Grant implicit authorization. The callback takes the `client` requesting
		// authorization, the authenticated `user` granting access, and
		// their response, which contains approved scope, duration, etc. as parsed by
		// the application. The application issues a token, which is bound to these
		// values.

		server.grant(oauth2orize.grant.token((client:any, user:any, ares:any, done:any) => {
		  console.log('3');
      OauthController.creat_new_user_token(client.userName).then( 
        (token) => { return done(null, token); },
        (error) => { return done(error); }
		  );
		}));

		// Exchange the client id and password/secret for an access token. The callback accepts the
		// `client`, which is exchanging the client's id and password/secret from the
		// authorization request for verification. If these values are validated, the
		// application issues an access token on behalf of the client who authorized the code.

		server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
		  // Validate the client
      console.log('2');
      OauthController.obtain_user_token(client.userName, client.secret_code).then(
        (token) => {
          if(token) return done(null, false);
          done(null, false);
        },
        (error) => { return done(error); }
      );
		}));
	}

  private static creat_new_user_token(user:User):Promise<Token>{
    let token = Utils.getUid(Config.oauth_token_size);
    return TokensDB.createUserToken(user.id,token); 
  }
  //Exist only on token active per user
  private static obtain_user_token_ru(user:User):Promise<Token>{
    return new Promise((resolve, reject) => {
        TokensDB.getTokenByUserId(user.id).then((token) => {
          if(!token) {
              OauthController.creat_new_user_token(user).then(resolve, reject);
          } else {
             resolve(token);
          }
      },reject);
    });
  }
  
  //Have Multiple valid token per user
  private static obtain_user_token_mt(user:User):Promise<Token>{
    return OauthController.creat_new_user_token(user); 
  }
  
  //Ony last token are active
  private static obtain_user_token_ol(user:User):Promise<Token>{
    return new Promise((resolve, reject) => { 
        TokensDB.removeUserToken(user.id).then(
          ()=>{ OauthController.creat_new_user_token(user).then(resolve, reject);},
          reject
        )
    });
  }

  private static create_new_admin_token():Promise<Token>{
     let token = Utils.getUid(Config.oauth_token_size);
    return TokensDB.createAdminToken(token);
  }

  //Exist only on token active per user
  private static obtain_admin_token_ru():Promise<Token>{
    return new Promise((resolve, reject) => { 
        TokensDB.getTokenAdmin().then((token) => {
            if(!token) {
                this.create_new_admin_token().then(resolve, reject);
            } else {
                resolve(token);
            }
        }, reject);
    });
  }
  
  //Have Multiple valid token per user
  private static obtain_admin_token_mt():Promise<Token>{
    return this.create_new_admin_token();
  }
  
  //Ony last token are active
  private static obtain_admin_token_ol():Promise<Token>{
    return new Promise((resolve, reject) => { 
        TokensDB.removeAdminToken().then(
          ()=>{ this.create_new_admin_token().then(resolve, reject);},
          reject
        )
      });
  }

  private static obtain_user_token(userName:string, secret_code:string):Promise<Token> {
    return new Promise((resolver, reject) => {
      UsersDB.findByUserName(userName).then(
        (user) => {
          if(!user || user.secret_code != secret_code) return resolver(null);
          if(Config.oauth_token_crate == RE_USE) return this.obtain_user_token_ru(user).then(resolver, reject);
          if(Config.oauth_token_crate == MULT_TOKEN) return this.obtain_user_token_mt(user).then(resolver, reject);
          if(Config.oauth_token_crate == ONLY_LAST) return this.obtain_user_token_ol(user).then(resolver, reject)
        }, reject);
    })
  }

  private static obtain_admin_token():Promise<any> {
    if(Config.oauth_token_crate == RE_USE) return this.obtain_admin_token_ru();
    if(Config.oauth_token_crate == MULT_TOKEN) return this.obtain_admin_token_mt();
    if(Config.oauth_token_crate == ONLY_LAST) return this.obtain_admin_token_ol();
    return new Promise((resolve, reject)=>{
      reject(new Error('Not Validate Politic'));
    });
  }

  private static obtain_user_token_service(userName:string, secret_code:string) {
    return (response) =>
    OauthController.obtain_user_token(userName, secret_code).then(
        (token) => {
          if(!token) return response.status(401).send(Error('Not validate credential'));
          response.status(201).send(token);
        },
        (error) => { return response.status(505).send(error); }
    );
  }

  private static obtain_admin_token_service() {
    return (response) =>
    OauthController.obtain_admin_token().then(
        (token) => {
          if(!token) return response.status(401).send(Error('Not validate credential'));
          response.status(201).send(token);
        },
        (error) => { return response.status(505).send(error); }
    );
  }

  //Method to server
	public post_obtain_user_token(requests, response) {
    let secret_code = requests.body.secret_code;
    let userName = requests.body.userName;
    OauthController.obtain_user_token_service(userName, secret_code)(response);
	}

  public get_obtain_user_token(requests, response) {
    console.log(requests);
    let secret_code =  requests.query.secret_code;
    let userName = requests.query.userName;
    OauthController.obtain_user_token_service(userName, secret_code)(response);
  }

  public post_obtain_admin_token(requests, response) {
    let admin_pass = requests.body.password;
    let admin_name = requests.body.name;
    if(admin_name != ConfigServis.admin_name || 
      admin_pass != ConfigServis.admin_pass) return response.status(401).send('Unauthorized');
    OauthController.obtain_admin_token_service()(response);
  }

  public get_obtain_admin_token(requests, response) {
    let admin_pass =  requests.query.pass;
    let admin_name = requests.query.name;
    OauthController.obtain_admin_token_service()(response);
  }
}
export default OauthController;