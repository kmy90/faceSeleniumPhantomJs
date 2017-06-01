"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
class SeleniumService {
    constructor(browser) {
        this.driver = new selenium_webdriver_1.Builder().forBrowser(browser).build();
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
        let { driver } = this;
        // pointers to step.findElements and step.actions
        let { findElement, action } = step;
        //if the action not require findElement action:
        if (!findElement) {
            if (typeof this[action.type + 'Handler'] === 'function')
                return this[action.type + 'Handler'](action);
            else
                return new Promise((resolve, reject) => { reject('The action "' + action.type + '" not is supported'); });
        }
        else {
            // building the query to locate the WebElement
            let stringQuery = '//' + findElement.tag + '[';
            // pointer to findElements.attribute
            let { attributes } = findElement;
            let counter = 0;
            for (let key in attributes) {
                counter += 1;
                stringQuery += "@" + key + "='" + attributes[key] + "'";
                if (counter != Object.keys(attributes).length)
                    stringQuery += ' and ';
            }
            stringQuery += ']';
            if (typeof this[action.type + 'Handler'] === 'function')
                return this[action.type + 'Handler'](stringQuery, action);
            else
                return new Promise((resolve, reject) => { reject('The action "' + action.type + '" not is supported'); });
        }
    }
    sendKeysHandler(stringQuery, action) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            let element = driver.findElement(selenium_webdriver_1.By.xpath(stringQuery));
            if (action.hasOwnProperty("keypress"))
                element.sendKeys(action.value, selenium_webdriver_1.Key[action.keypress]).then(resolve).catch(reject);
            else
                element.sendKeys(action.value).then(resolve).catch(reject);
        });
    }
    clickHandler(stringQuery, action) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.findElement(selenium_webdriver_1.By.xpath(stringQuery)).click().then(resolve).catch(reject);
        });
    }
    waitHandler(action) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.wait(() => {
                return driver[action.for]().then((argument) => {
                    return argument.includes(action.includes);
                });
            }, action.timeout).then(resolve).catch(reject);
        });
    }
    quitHandler(action) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.quit()
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.SeleniumService = SeleniumService;
