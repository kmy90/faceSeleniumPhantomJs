import { Router, Request , Response, NextFunction } from 'express'
import { FacebookMessageController } from '../controllers/facebookMessageController'

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

   
}

const facebookMessageRouter = new FacebookMessageRouter();
facebookMessageRouter.init();

export default (facebookMessageRouter.router); 