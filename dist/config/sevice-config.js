"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceConfig {
}
ServiceConfig.selenium_selected_browser = (process.env.S_SELENIUM_SELECTED_BROWSER || 'phantomjs');
ServiceConfig.admin_name = (process.env.OAUTH_ADMIN_NAME || 'admin');
ServiceConfig.admin_pass = (process.env.OAUTH_ADMIN_PASS || 'pass');
exports.ServiceConfig = ServiceConfig;
exports.default = ServiceConfig;
