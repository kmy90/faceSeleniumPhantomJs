import { Builder, By, until, Key, ThenableWebDriver} from 'selenium-webdriver'
import { Step } from './types/Step'

export class SeleniumService {
    driver : any;

    constructor( browser:string ) {
        this.driver = new Builder().forBrowser(browser).build();
    }

    public getUrl(url:string): Promise<SeleniumService> {
         let { driver } = this;
         return new Promise((resolve, reject) => {
                let pr = driver.get(url)
                    .then(resolve)
                    .catch(reject);
         });
    }

    public setStep(step:Step): Promise<SeleniumService> {
        
        let { driver } = this;
        // pointers to step.findElements and step.actions
        let { findElement, action } = step;
        //if the action not require findElement action:
 
        if(findElement == false){
            if(typeof this[action.type+'Handler'] === 'function')
              return this[action.type+'Handler'](action)
            else return new Promise((resolve,reject)=>{ reject('The action "'+ action.type +'" not is supported') });
        }else{
            // building the query to locate the WebElement
            let stringQuery = '//' + findElement.tag +  '[';
            // pointer to findElements.attribute
            let { attributes } = findElement;
            let counter = 0;
            for(let key in attributes){                   
                counter+=1;
                stringQuery+= "@" + key + "='" +attributes[key] + "'";
                if(counter != Object.keys(attributes).length) stringQuery +=' and ';
            }
            stringQuery+=']';

            if(typeof this[action.type+'Handler'] === 'function')
              return this[action.type+'Handler'](stringQuery, action)
            else return new Promise((resolve,reject)=>{ reject('The action "'+ action.type +'" not is supported') });
        }
    }

    private sendKeysHandler(stringQuery:string,action:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
            if(action.hasOwnProperty("keypress"))
                driver.findElement(By.xpath(stringQuery)).sendKeys(action.value, Key[action.keypress]).then(resolve).catch(reject)
            else
                driver.findElement(By.xpath(stringQuery)).sendKeys(action.value).then(resolve).catch(reject)
              
        });
    }   
    private clickHandler(stringQuery:string,action:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
             driver.findElement(By.xpath(stringQuery)).click().then(resolve).catch(reject);
        });
    }
  
    private waitHandler(action:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.wait(() => {
               return driver[action.for]().then((argument) => {
                    return argument.includes(action.includes);
                });
           }, action.timeout).then(resolve).catch(reject);
        });
    }

    private quitHandler(action:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
                     driver.quit()
                    .then(resolve)
                    .catch(reject);
        });
    }


} 