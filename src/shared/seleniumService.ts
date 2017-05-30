import { Builder, By, until, Key, ThenableWebDriver} from 'selenium-webdriver'
import { InputAction } from './types/InputAction'

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

    public setInputAction(input:InputAction) : Promise<SeleniumService> {
        let searcherParameter = (input.searcherParameter!='') ? input.searcherParameter : '*';
        let stringQuery = '//' + searcherParameter +  '[';
       
        let counter = 0;
        for (let attr of input.htmlAttributes) {
            counter+=1;
            stringQuery+= "@" + attr.name + "='" +attr.value + "'";
            if(counter != input.htmlAttributes.length) stringQuery +=' and ';
        }
        
        stringQuery+=']';
    
        return new Promise((resolve,reject)=>{
            let { driver } = this;
            if(input.requireExtraAction){
                if(input.extraAction=='click'){
                    driver.findElement(By.xpath(stringQuery)).click().then(resolve).catch(reject);
                }else{
                    let keyvalue = input.extraAction;
                    driver.findElement(By.xpath(stringQuery)).sendKeys(input.sendValue, Key[keyvalue]).then(resolve).catch(reject);
                }
            }else{
                driver.findElement(By.xpath(stringQuery)).sendKeys(input.sendValue).then(resolve).catch(reject);
            }
        });
    }

    public waitByExpectedTitle(expectedTitle:string, time:number): Promise<SeleniumService>{
        let { driver } = this;
        return new Promise((resolve, reject) => {
            driver.wait(() => {
               return driver.getTitle().then((title) => {
                    return title.includes(expectedTitle);
                });
           }, time).then(resolve).catch(reject);
        });
    }

    public closeDriver(): Promise<SeleniumService> {
         let { driver } = this;
         return new Promise((resolve, reject) => {
                     driver.quit()
                    .then(resolve)
                    .catch(reject);
         });
    }
    



    

} 