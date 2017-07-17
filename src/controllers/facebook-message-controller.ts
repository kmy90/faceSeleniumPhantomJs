import { Request , Response } from 'express'
import SeleniumService from '../services/selenium-service';
import { Step, SeleniumServiceResponse  } from '../models';

export class FacebookMessageController {
  
  constructor() {}


   public sendAutomatedMessage(request: Request, response: Response) {
      console.log('Running Controller FacebookMessageController');
      let selService = new SeleniumService();
      let proccessedSteps = [];
      //get Url
      selService.getUrl(request.body.endpoint_x).then(() => {
         var steps = request.body.steps_x;
         FacebookMessageController.processSteps(steps.reverse(),selService,proccessedSteps).then((processedSteps)=>{
           response.status(200).send(FacebookMessageController.buildSeleniumServiceResponse("Success",proccessedSteps,null));
        //getting errors processing step       
         },(err)=>{response.status(200).send(FacebookMessageController.buildSeleniumServiceResponse("Fail",proccessedSteps,err))});
      //getting errors processing url
      },(err) => {response.status(200).send(FacebookMessageController.buildSeleniumServiceResponse("Fail",proccessedSteps,err))}); 
   }

   private static processSteps(steps:Step[],selService:SeleniumService, processedSteps:Step[] ): Promise<Step> {
     return new Promise((resolve,reject)=>{
          let step = steps.pop();
          selService.setStep(step).then(()=>{
             processedSteps.push(step);
             if(steps.length == 0){
                  resolve(processedSteps);
             }else{
                this.processSteps(steps,selService,processedSteps).then(resolve, reject);
             }
         },(err)=>{reject(err)});
     });
  }

  private static buildSeleniumServiceResponse(status:string, processedSteps:Step[], failReason:string) : SeleniumServiceResponse {
     let response  =  new SeleniumServiceResponse();
     response.status_x = status;
     response.steps_x = processedSteps;
     if(failReason) response.message_x = failReason;
     return response;
  }
}
export default FacebookMessageController;