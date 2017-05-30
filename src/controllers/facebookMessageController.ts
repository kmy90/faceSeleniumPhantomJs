import { Request , Response } from 'express'
import { SeleniumService } from '../shared/seleniumService'

export class FacebookMessageController {
     constructor() {}
     public sendAutomatedMessage(request: Request, response: Response) {
        let selService = new SeleniumService('phantomjs');
        //get Url
        selService.getUrl(request.body.endpoint + request.body.recipientId).then(() => {
           // Auth actions
           let actions = request.body.login_input_actions.reverse();
           let loginActionsPromise = new Promise((resolve,reject)=>{
                do{
                let action = actions.pop();
                    selService.setInputAction(action).then(()=>{
                        if(actions.length == 0) resolve();
                    },(err)=>{
                    actions = [];
                    reject(err);
                });
                } while (actions.length != 0)
           });
           loginActionsPromise.then(()=>{
               selService.waitByExpectedTitle(request.body.expected_title_after_auth,3500).then(()=>{
                    // After Login Action
                    let actions = request.body.actions_after_login.reverse();
                    let afterLoginActionsPromise = new Promise((resolve,reject)=>{
                        do{
                        let action = actions.pop();
                            selService.setInputAction(action).then(()=>{
                                if(actions.length == 0) resolve();
                            },(err)=>{
                            actions = [];
                            reject(err);
                        });
                        } while (actions.length != 0)
                    });
                    afterLoginActionsPromise.then(()=>{
                       selService.closeDriver().then(()=>{
                            //finish action.
                            response.status(201).send('Done');
                        //getting error closing driver            
                       },(err)=>{response.status(500).send(err);console.log('getting error closing driver')});
                    //getting error in after login actions    
                    },(err)=>{response.status(500).send(err);console.log('getting error in after login actions ')});
               //getting error waiting by title
               },(err)=>{response.status(500).send(err);console.log('getting error waiting by title')});
           //getting Error Login into Endpoint     
           },(err)=>{response.status(500).send(err);console.log('getting Error Login into Endpoint   ')});
        //getting URL Error     
        },(err) => {response.status(500).send(err);console.log('getting URL Error ')}); 
     }
}