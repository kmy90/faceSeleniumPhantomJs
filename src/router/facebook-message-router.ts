import { Router, Request , Response, NextFunction } from 'express'
import FacebookMessageController from '../controllers/facebook-message-controller'

export class FacebookMessageRouter {
    router: Router;
    controller: FacebookMessageController;

    constructor() {
        this.router = Router();
        this.controller = new FacebookMessageController();
        this.init();
    }
    
    init(){
        this.router.post('/send',this.controller.sendAutomatedMessage);
    }

    public static getRouter():Router {
       const facebookMessageRouter = new FacebookMessageRouter();
       facebookMessageRouter.init();
       return(facebookMessageRouter.router);      
    }
   
}
export default FacebookMessageRouter; 