import { Builder, By, until, Key, ThenableWebDriver} from 'selenium-webdriver'
import { Step } from '../models';
import Config from '../config/service-config';
import * as moment from 'moment-timezone';

export class SeleniumService {
    driver : any
    MSG_NO_FOUND_ELEMENT : string = 'No found element for query: '
    MSG_ACTION_NO_SUPPORTED : string = 'Action no supported: '
    MSG_ACTION_NO_SUPPORTED_ON_ELEMENT: string = 'Action no supported on element: '
    
    constructor( ) {
        this.driver = new Builder().forBrowser(Config.selenium_selected_browser).build();
        console.log('Selenium webdriver initialized to ' + Config.selenium_selected_browser);
    }

    public getUrl(url:string): Promise<SeleniumService> {
         let { driver } = this;
         return new Promise((resolve, reject) => {
                let pr = driver.get(url)
                    .then(resolve)
                    .catch(()=>{
                        reject();
                        this.forceQuit()
                    });
         });
    }
    
    public setStep(step:Step): Promise<SeleniumService> {
        let { driver } = this;
        // pointers to step.findElement_x and step.action_x
        let { findElement_x, action_x } = step;
        console.log('Executing Step');
        console.log(step);
        //if the action_x not require findElement_x action_x:
        if(!findElement_x){
            if(typeof this[action_x.type_x+'Handler'] === 'function')
              return this[action_x.type_x+'Handler'](action_x,step)
            else return new Promise((resolve,reject)=>{
                reject(this.MSG_ACTION_NO_SUPPORTED + action_x.type_x);
                this.forceQuit() 
            });
     
       } else {
            // building the query to locate the WebElement
            let stringQuery = '//' + findElement_x.nodeName_x +  '[';
            // pointer to findElement_x.attribute
            let { attributes_x } = findElement_x;
            let counter = 0;
            attributes_x.forEach(attribute => {
                counter+=1;
                if(attribute.name_x == 'contains()'){
                    stringQuery+= "contains(text(), '"+attribute.value_x+"')";
                }else{
                    stringQuery+= "@" + attribute.name_x + "='" + attribute.value_x + "'";
                }
                if(counter != Object.keys(attributes_x).length) stringQuery +=' and ';
           
         });
            
            stringQuery+=']';
            if(!action_x){
                return this.justFind(stringQuery,step);
            }else{
                if(typeof this[action_x.type_x+'Handler'] === 'function')
                    return this[action_x.type_x+'Handler'](stringQuery, action_x, step)              
                else return new Promise((resolve,reject)=>{ 
                    reject(this.MSG_ACTION_NO_SUPPORTED + action_x.type_x);
                    this.forceQuit() 
                });
            }
        }
    }

    private sendKeysHandler(stringQuery:string,action_x:any, step:Step): Promise<SeleniumService>{
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            let element = driver.findElement(By.xpath(stringQuery));
            if(action_x.keypress_x)
                element.sendKeys(action_x.value_x, Key[action_x.keypress_x]).then(()=> {
                    this.logEndTime(step);
                    resolve()
                }).catch(()=>{
                    reject(this.MSG_ACTION_NO_SUPPORTED_ON_ELEMENT+ stringQuery);
                    this.forceQuit()
                })    
            else
                element.sendKeys(action_x.value_x).then(()=> { this.logEndTime(step);resolve()}).catch(()=>{reject(this.MSG_ACTION_NO_SUPPORTED_ON_ELEMENT+ stringQuery)})  
        });
    }   
    private clickHandler(stringQuery:string,action_x:any,step:Step): Promise<SeleniumService>{
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
        driver.findElement(By.xpath(stringQuery)).click().then(()=> {
            this.logEndTime(step);
            resolve();
        }).catch(()=>{
            reject(this.MSG_ACTION_NO_SUPPORTED_ON_ELEMENT+ stringQuery);
            this.forceQuit()
        });
     });
    }
  
    private waitHandler(action_x:any,step:Step): Promise<SeleniumService>{
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            driver.wait(() => {
               return driver[action_x.for_x]().then((argument) => {
                    if( argument.includes(action_x.includes_x)){
                        this.logEndTime(step);resolve();
                        return true;
                    }
                    reject("'"+action_x.includes_x+"' has been not found it with method "+action_x.for_x);
                    return false;
               })
           }, action_x.timeout).catch(()=>{
                this.forceQuit();  
           });
        });
    }

    private quitHandler(action_x:any,step:Step): Promise<SeleniumService>{
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            driver.quit().then(()=> { 
                this.logEndTime(step);
                resolve()
            }).catch(reject)
        });
    }
    
    private justFind(stringQuery:string,step){
        let { driver } = this;
        this.logStarTime(step);
        return new Promise((resolve, reject) => {
            driver.findElement(By.xpath(stringQuery)).then(()=> { 
                this.logEndTime(step);
                resolve()
            }).catch(()=>{
                reject(this.MSG_NO_FOUND_ELEMENT+ stringQuery);
                this.forceQuit()
            });
        });
    }

    private logStarTime(step:Step):void {
        step["start_action_time_x"] = moment().utc().format("YYYY-MM-DDTHH:mm:ssZZ");
    }
    
    private logEndTime(step:Step):void {
        step["end_action_time_x"] = moment().utc().format("YYYY-MM-DDTHH:mm:ssZZ");
    }

    public forceQuit(){
       this.driver.quit();
       console.log('Driver Closed');
    }

}
export default SeleniumService;