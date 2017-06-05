"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_config_1 = require("../config/service-config");
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
    static encriptPass(pass) {
        return pass;
    }
    static validatePass(pass, encr_pass) {
        return pass === encr_pass;
    }
    static validateAdmin(adminName, adminPass) {
        return (adminName != service_config_1.default.admin_name ||
            adminPass != service_config_1.default.admin_pass);
    }
}
exports.Utils = Utils;
exports.default = Utils;
