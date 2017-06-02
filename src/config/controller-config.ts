export class ControllerConfig {
  public static oauth_token_crate:string = (process.env.C_OAUTH_TOKEN_CREATE || 'RE-USE');
  public static user_secert_code_size:number = (process.env.C_USER_SECRET_CODE_SIZE) || (24);
  public static oauth_token_size:number = (process.env.C_OAUTH_TOKEN_SIZE) || (16);
}
export default ControllerConfig;