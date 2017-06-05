import * as sha from 'js-sha3';
import ConfigServis from '../config/service-config';

export class Utils {

    public static getUid(length):string {
      let uid = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charsLength = chars.length;

      for (let i = 0; i < length; ++i) {
        uid += chars[this.getRandomInt(0, charsLength - 1)];
      }

      return uid;
    }

    private static  getRandomInt(min, max):number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static encriptPass(pass:string):string {
      return sha.sha3_256(pass);
    }

    public static validatePass(pass:string, encr_pass:string):boolean {
      return Utils.encriptPass(pass) === encr_pass;
    }

    public static validateAdmin(adminName:string, adminPass:string):boolean {
      console.log('Service', ConfigServis.admin_name, ConfigServis.admin_pass)
      return (adminName == ConfigServis.admin_name &&
        adminPass == ConfigServis.admin_pass);
    }
}
export default Utils;
