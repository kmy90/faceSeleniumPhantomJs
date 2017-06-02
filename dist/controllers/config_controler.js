"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigController {
}
ConfigController.oauth_token_crate = (process.env.OAUTH_TOKEN_CREATE || 'RE-USE');
ConfigController.oauth_admin_name = (process.env.OAUTH_ADMIN_NAME || 'admin');
ConfigController.oauth_admin_pass = (process.env.OAUTH_ADMIN_PASS || 'pass');
exports.default = ConfigController;
