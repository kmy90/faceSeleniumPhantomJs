import * as oauth2orize from 'oauth2orize';
import passport from 'passport';
import { TokensDB, UsersDB } from '../db';
import { Utils } from '../utils';
import ConfigController from './config_controler';

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

		server.serializeClient((client, done) => done(null, client.id));
		server.deserializeClient((id, done) => {
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
		  TokensDB.createUserToken(client.userName).then( 
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
      OauthController.obtain_user_token(client.userName, client.secret_code).then(
        (token) => {
          if(token) return done(null, false);
          done(null, false);
        },
        (error) => { return done(error); }
      );
		}));
	}

  //Exist only on token active per user
  private static obtain_user_token_ru(userName:string, secret_code:string):Promise<any>{
    return new Promise((resolve, reject) => { 
      UsersDB.findByUserName(userName).then(
      (user) => {
        if(!user || user.secret_code != secret_code) return resolve(null);
        TokensDB.getTokenByUserId(user.id).then((token) => {
            if(!token) {
                TokensDB.createUserToken(user.id).then(resolve, reject);
            } else {
                resolve(token);
            }
        }, reject);
      },reject);
    });
  }
  
  //Have Multiple valid token per user
  private static obtain_user_token_mt(userName:string, secret_code:string):Promise<any>{
    return new Promise((resolve, reject) => { 
      UsersDB.findByUserName(userName).then(
      (user) => {
        if(!user || user.secret_code != secret_code) return resolve(null);
        TokensDB.createUserToken(user.id).then(resolve, reject);
      },reject);
    });
  }
  
  //Ony last token are active
  private static obtain_user_token_ol(userName:string, secret_code:string):Promise<any>{
    return new Promise((resolve, reject) => { 
      UsersDB.findByUserName(userName).then(
      (user) => {
        if(!user || user.secret_code != secret_code) return resolve(null);
        TokensDB.removeUserToken(user.id).then(
          ()=>{TokensDB.createUserToken(user.id).then(resolve, reject);},
          reject
        )
      },reject);
    });
  }

  //Exist only on token active per user
  private static obtain_admin_token_ru(admin_name:string, admin_pass:string):Promise<any>{
    return new Promise((resolve, reject) => { 
        if(admin_name != ConfigController.oauth_admin_name || 
           admin_pass != ConfigController.oauth_admin_pass) return resolve(null);
        TokensDB.getTokenAdmin().then((token) => {
            if(!token) {
                TokensDB.createAdminToken().then(resolve, reject);
            } else {
                resolve(token);
            }
        }, reject);
    });
  }
  
  //Have Multiple valid token per user
  private static obtain_admin_token_mt(admin_name:string, admin_pass:string):Promise<any>{
    return new Promise((resolve, reject) => { 
        if(admin_name != ConfigController.oauth_admin_name || 
           admin_pass != ConfigController.oauth_admin_pass)return resolve(null);
        TokensDB.createAdminToken().then(resolve, reject);
    });
  }
  
  //Ony last token are active
  private static obtain_admin_token_ol(admin_name:string, admin_pass:string):Promise<any>{
    return new Promise((resolve, reject) => { 
        if(admin_name != ConfigController.oauth_admin_name || 
           admin_pass != ConfigController.oauth_admin_pass) return resolve(null);
        TokensDB.removeAdminToken().then(
          ()=>{TokensDB.createAdminToken().then(resolve, reject);},
          reject
        )
      });
  }

  private static obtain_user_token(userName:string, secret_code:string):Promise<any> {
    if(ConfigController.oauth_token_crate == RE_USE) return OauthController.obtain_user_token_ru(userName, secret_code);
    if(ConfigController.oauth_token_crate == MULT_TOKEN) return OauthController.obtain_user_token_mt(userName, secret_code);
    if(ConfigController.oauth_token_crate == ONLY_LAST) return OauthController.obtain_user_token_ol(userName, secret_code);
    return new Promise((resolve, reject)=>{
      reject(new Error('Not Validate Politic'));
    });
  }

  private static obtain_admin_token(admin_name:string, admin_pass:string):Promise<any> {
    if(ConfigController.oauth_token_crate == RE_USE) return OauthController.obtain_admin_token_ru(admin_name, admin_pass);
    if(ConfigController.oauth_token_crate == MULT_TOKEN) return OauthController.obtain_admin_token_mt(admin_name, admin_pass);
    if(ConfigController.oauth_token_crate == ONLY_LAST) return OauthController.obtain_admin_token_ol(admin_name, admin_pass);
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

  private static obtain_admin_token_service(admin_name:string, admin_pass:string) {
    return (response) =>
    OauthController.obtain_admin_token(admin_name, admin_pass).then(
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
    let secret_code =  requests.query.secret_code;
    let userName = requests.query.userName;
    OauthController.obtain_user_token_service(userName, secret_code)(response);
  }

  public post_obtain_admin_token(requests, response) {
    let admin_pass = requests.body.password;
    let admin_name = requests.body.name;
    OauthController.obtain_admin_token_service(admin_name, admin_pass)(response);
  }

  public get_obtain_admin_token(requests, response) {
    let admin_pass =  requests.query.pass;
    let admin_name = requests.query.name;
    OauthController.obtain_admin_token_service(admin_name, admin_pass)(response);
  }
}