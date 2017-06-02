import { Request , Response } from 'express'
import SeleniumService from '../services/selenium-service';
import { Step } from '../models';
import Config from '../config/controller-config';


export class FacebookMessageController {
  constructor() {}
   public sendAutomatedMessage(request: Request, response: Response) {
      let selService = new SeleniumService(Config.selenium_selected_browser);
      //get Url
      selService.getUrl(request.body.endpoint_x).then(() => {
         let steps = request.body.steps_x;
         FacebookMessageController.processSteps(steps.reverse(),selService).then(()=>{
           response.status(201).send('Done')
      //getting errors processing step       
      },(err)=>{response.status(500).send(err);console.log('getting errors processing step')});
      //getting errors processing url
      },(err) => {response.status(500).send(err);console.log('getting errors processing url')}); 
   }

   private static processSteps(steps:Step[],selService:SeleniumService): Promise<Step> {
     return new Promise((resolve,reject)=>{
          let step = steps.pop();
          selService.setStep(step).then(()=>{
             if(steps.length == 0){
                  resolve();
             }else{
                this.processSteps(steps,selService).then(resolve, reject);
             }
         },(err)=>{reject(err)});
     });
  }
}
export default FacebookMessageController;