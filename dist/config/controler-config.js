"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ControllerConfig {
}
ControllerConfig.oauth_token_crate = (process.env.OAUTH_TOKEN_CREATE || 'RE-USE');
ControllerConfig.oauth_admin_name = (process.env.OAUTH_ADMIN_NAME || 'admin');
ControllerConfig.oauth_admin_pass = (process.env.OAUTH_ADMIN_PASS || 'pass');
exports.ControllerConfig = ControllerConfig;
exports.default = ControllerConfig;
