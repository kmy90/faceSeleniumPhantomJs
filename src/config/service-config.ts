export class ServiceConfig {
  public static selenium_selected_browser = ( process.env.S_SELENIUM_SELECTED_BROWSER || 'phantomjs' );
  public static api_version:string = 'v1.0';
  public static admin_name:string = (process.env.OAUTH_ADMIN_NAME || 'admin');
  public static admin_pass:string = (process.env.OAUTH_ADMIN_PASS || 'pass');
}
export default ServiceConfig;