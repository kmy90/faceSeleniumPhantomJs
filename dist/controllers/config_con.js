"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigCon {
}
// RE-USE, MULTITOKEN, ONLY-LAST
ConfigCon.oauth_token_crate = (process.env.OAUTH_TOKEN_CREATE || 'RE-USE');
exports.default = ConfigCon;
