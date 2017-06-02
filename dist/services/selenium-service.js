"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const service_config_1 = require("../config/service-config");
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
                return this[action_x.type_x + 'Handler'](action_x);
            else
                return new Promise((resolve, reject) => { reject('The action "' + action_x.type_x + '" not is supported'); });
        }
        else {
            // building the query to locate the WebElement
            let stringQuery = '//' + findElement_x.nodeName_x + '[';
            // pointer to findElement_x.attribute
            let { attributes_x } = findElement_x;
            let counter = 0;
            for (let key in attributes_x) {
                counter += 1;
                stringQuery += "@" + key + "='" + attributes_x[key] + "'";
                if (counter != Object.keys(attributes_x).length)
                    stringQuery += ' and ';
            }
            stringQuery += ']';
            if (typeof this[action_x.type_x + 'Handler'] === 'function')
                return this[action_x.type_x + 'Handler'](stringQuery, action_x);
            else
                return new Promise((resolve, reject) => { reject('The action "' + action_x.type_x + '" is not supported'); });
        }
    }
    sendKeysHandler(stringQuery, action_x) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            let element = driver.findElement(selenium_webdriver_1.By.xpath(stringQuery));
            if (action_x.hasOwnProperty("keypress_x"))
                element.sendKeys(action_x.value_x, selenium_webdriver_1.Key[action_x.keypress_x]).then(resolve).catch(reject);
            else
                element.sendKeys(action_x.value_x).then(resolve).catch(reject);
        });
    }
    clickHandler(stringQuery, action_x) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.findElement(selenium_webdriver_1.By.xpath(stringQuery)).click().then(resolve).catch(reject);
        });
    }
    waitHandler(action_x) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.wait(() => {
                return driver[action_x.for_x]().then((argument) => {
                    return argument.includes(action_x.includes_x);
                });
            }, action_x.timeout).then(resolve).catch(reject);
        });
    }
    quitHandler(action_x) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.quit()
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.SeleniumService = SeleniumService;
exports.default = SeleniumService;
