"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigDB {
}
ConfigDB.urlConect = (process.env.MONGODB_URI || 'mongodb://localhost:27017/messageApi');
ConfigDB.token_expire_time = (process.env.TOKEN_EXPIRE) || (60 * 60 * 1000);
ConfigDB.token_refresh_time = (process.env.TOKEN_REFRESH_TIME) || (10 * 1000);
ConfigDB.token_size = (process.env.TOKEN_SIZE) || (16);
ConfigDB.user_secert_code_size = (process.env.USER_SECRET_CODE_SIZE) || (24);
exports.default = ConfigDB;
