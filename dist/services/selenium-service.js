"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const service_config_1 = require("../config/service-config");
const moment = require("moment-timezone");
class SeleniumService {
    constructor() {
        this.driver = new selenium_webdriver_1.Builder().forBrowser(service_config_1.default.selenium_selected_browser).build();
    }
    getUrl(url) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            let pr = driver.get(url)
                .then(resolve)
                .catch(reject);
        });
    }
    setStep(step) {
        console.log(step);
        let { driver } = this;
        // pointers to step.findElement_x and step.action_x
        let { findElement_x, action_x } = step;
        //if the action_x not require findElement_x action_x:
        if (!findElement_x) {
            if (typeof this[action_x.type_x + 'Handler'] === 'function')
                return this[action_x.type_x + 'Handler'](action_x, step);
            else
                return new Promise((resolve, reject) => { reject('The action "' + action_x.type_x + '" not is supported'); });
        }
        else {
            // building the query to locate the WebElement
            let stringQuery = '//' + findElement_x.nodeName_x + '[';
            // pointer to findElement_x.attribute
            let { attributes_x } = findElement_x;
            let counter = 0;
            attributes_x.forEach(attribute => {
                counter += 1;
                stringQuery += "@" + attribute.name_x + "='" + attribute.value_x + "'";
                if (counter != Object.keys(attributes_x).length)
                    stringQuery += ' and ';
            });
            stringQuery += ']';
            if (typeof this[action_x.type_x + 'Handler'] === 'function')
                return this[action_x.type_x + 'Handler'](stringQuery, action_x, step);
            else
                return new Promise((resolve, reject) => { reject('The action "' + action_x.type_x + '" is not supported'); });
        }
    }
    sendKeysHandler(stringQuery, action_x, step) {
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            let element = driver.findElement(selenium_webdriver_1.By.xpath(stringQuery));
            if (action_x.keypress_x)
                element.sendKeys(action_x.value_x, selenium_webdriver_1.Key[action_x.keypress_x]).then(() => { this.logEndTime(step); resolve(); }).catch(reject);
            else
                element.sendKeys(action_x.value_x).then(() => { this.logEndTime(step); resolve(); }).catch(reject);
        });
    }
    clickHandler(stringQuery, action_x, step) {
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            driver.findElement(selenium_webdriver_1.By.xpath(stringQuery)).click().then(() => { this.logEndTime(step); resolve(); }).catch(reject);
        });
    }
    waitHandler(action_x, step) {
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            driver.wait(() => {
                return driver[action_x.for_x]().then((argument) => {
                    if (argument.includes(action_x.includes_x)) {
                        this.logEndTime(step);
                        resolve();
                        return true;
                    }
                    reject("'" + action_x.includes_x + "' has been not found it with method " + action_x.for_x);
                    return false;
                });
            }, action_x.timeout);
        });
    }
    quitHandler(action_x, step) {
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            driver.quit().then(() => { this.logEndTime(step); resolve(); }).catch(reject);
        });
    }
    logStarTime(step) {
        let setdate = moment();
        step["start_action_time_x"] = setdate.tz("GMT").format('YYYY-MM-DD HH:mm');
    }
    logEndTime(step) {
        let setdate = moment();
        step["end_action_time_x"] = setdate.tz("GMT").format('YYYY-MM-DD HH:mm ');
    }
}
exports.SeleniumService = SeleniumService;
exports.default = SeleniumService;
