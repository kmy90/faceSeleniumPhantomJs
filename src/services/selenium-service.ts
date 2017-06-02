import { Builder, By, until, Key, ThenableWebDriver} from 'selenium-webdriver'
import { Step } from '../models';

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
        console.log(step);
        let { driver } = this;
        // pointers to step.findElement_x and step.action_x
        let { findElement_x, action_x } = step;
        //if the action_x not require findElement_x action_x:
        if(!findElement_x){
            if(typeof this[action_x.type_x+'Handler'] === 'function')
              return this[action_x.type_x+'Handler'](action_x)
            else return new Promise((resolve,reject)=>{ reject('The action "'+ action_x.type_x +'" not is supported') });
     
       } else {
            // building the query to locate the WebElement
            let stringQuery = '//' + findElement_x.nodeName_x +  '[';
            // pointer to findElement_x.attribute
            let { attributes_x } = findElement_x;
            let counter = 0;
            for(let key in attributes_x){                   
                counter+=1;
                stringQuery+= "@" + key + "='" +attributes_x[key] + "'";
                if(counter != Object.keys(attributes_x).length) stringQuery +=' and ';
            }
            stringQuery+=']';
            if(typeof this[action_x.type_x+'Handler'] === 'function')
              return this[action_x.type_x+'Handler'](stringQuery, action_x)
            else return new Promise((resolve,reject)=>{ reject('The action "'+ action_x.type_x +'" is not supported') });
        }
    }

    private sendKeysHandler(stringQuery:string,action_x:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
            let element = driver.findElement(By.xpath(stringQuery));
            if(action_x.keypress_x)
                element.sendKeys(action_x.value_x, Key[action_x.keypress_x]).then(resolve).catch(reject)
            else
                element.sendKeys(action_x.value_x).then(resolve).catch(reject)
        });
    }   
    private clickHandler(stringQuery:string,action_x:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
             driver.findElement(By.xpath(stringQuery)).click().then(resolve).catch(reject);
        });
    }
  
    private waitHandler(action_x:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.wait(() => {
               return driver[action_x.for_x]().then((argument) => {
                    return argument.includes(action_x.includes_x);
                });
           }, action_x.timeout).then(resolve).catch(reject);
        });
    }

    private quitHandler(action_x:any): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
                     driver.quit()
                    .then(resolve)
                    .catch(reject);
        });
    }
}
export default SeleniumService;