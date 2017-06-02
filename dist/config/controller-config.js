"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ControllerConfig {
}
ControllerConfig.oauth_token_crate = (process.env.C_OAUTH_TOKEN_CREATE || 'RE-USE');
ControllerConfig.user_secert_code_size = (process.env.C_USER_SECRET_CODE_SIZE) || (24);
ControllerConfig.oauth_token_size = (process.env.C_OAUTH_TOKEN_SIZE) || (16);
exports.ControllerConfig = ControllerConfig;
exports.default = ControllerConfig;
