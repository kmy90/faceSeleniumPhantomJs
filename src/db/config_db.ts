export default class ConfigDB {
  public static urlConect:string = (process.env.MONGODB_URI || 'mongodb://localhost:27017/messageApi');
  public static token_expire_time:number = (process.env.TOKEN_EXPIRE) || (60*60*1000);
  public static token_refresh_time:number = (process.env.TOKEN_REFRESH_TIME) || (10*1000);
  public static token_size:number = (process.env.TOKEN_SIZE) || (16);
}