export default class ConfigDB {
  static urlConect:string = (process.env.MONGODB_URI || 'mongodb://localhost:27017/messageApi');
}