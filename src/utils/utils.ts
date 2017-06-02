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
}
export default Utils;
