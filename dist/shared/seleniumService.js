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
    setInputAction(input) {
        let searcherParameter = (input.searcherParameter != '') ? input.searcherParameter : '*';
        let stringQuery = '//' + searcherParameter + '[';
        let counter = 0;
        for (let attr of input.htmlAttributes) {
            counter += 1;
            stringQuery += "@" + attr.name + "='" + attr.value + "'";
            if (counter != input.htmlAttributes.length)
                stringQuery += ' and ';
        }
        stringQuery += ']';
        return new Promise((resolve, reject) => {
            let { driver } = this;
            if (input.requireExtraAction) {
                if (input.extraAction == 'click') {
                    driver.findElement(selenium_webdriver_1.By.xpath(stringQuery)).click().then(resolve).catch(reject);
                }
                else {
                    let keyvalue = input.extraAction;
                    driver.findElement(selenium_webdriver_1.By.xpath(stringQuery)).sendKeys(input.sendValue, selenium_webdriver_1.Key[keyvalue]).then(resolve).catch(reject);
                }
            }
            else {
                driver.findElement(selenium_webdriver_1.By.xpath(stringQuery)).sendKeys(input.sendValue).then(resolve).catch(reject);
            }
        });
    }
    waitByExpectedTitle(expectedTitle, time) {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.wait(() => {
                return driver.getTitle().then((title) => {
                    return title.includes(expectedTitle);
                });
            }, time).then(resolve).catch(reject);
        });
    }
    closeDriver() {
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.quit()
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.SeleniumService = SeleniumService;
