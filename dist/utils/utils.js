"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static getUid(length) {
        let uid = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charsLength = chars.length;
        for (let i = 0; i < length; ++i) {
            uid += chars[this.getRandomInt(0, charsLength - 1)];
        }
        return uid;
    }
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.Utils = Utils;
