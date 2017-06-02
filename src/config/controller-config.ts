export class ControllerConfig {
  public static oauth_token_crate:string = (process.env.OAUTH_TOKEN_CREATE || 'RE-USE');
  public static oauth_admin_name:string = (process.env.OAUTH_ADMIN_NAME|| 'admin');
  public static oauth_admin_pass:string = (process.env.OAUTH_ADMIN_PASS || 'pass');
  public static selenium_selected_browser = ( process.env.SELENIUM_SELECTED_BROWSER || 'phantomjs' );
}
export default ControllerConfig;