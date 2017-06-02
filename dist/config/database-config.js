"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataBaseConfig {
}
DataBaseConfig.urlConect = (process.env.MONGODB_URI || 'mongodb://localhost:27017/messageApi');
DataBaseConfig.token_expire_time = (process.env.DB_TOKEN_EXPIRE) || (60 * 60 * 1000);
DataBaseConfig.token_refresh_time = (process.env.DB_TOKEN_REFRESH_TIME) || (10 * 1000);
exports.DataBaseConfig = DataBaseConfig;
exports.default = DataBaseConfig;
