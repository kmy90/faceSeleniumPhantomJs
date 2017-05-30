import { Router } from 'express'
import { OauthController } from '../controllers/oauthController'

export class OauthRouter {
    router: Router;
    controller: OauthController;

    constructor() {
        this.router = Router();
        this.controller = new OauthController();
        this.init();
    }

    init(){
        this.router.post('/token',this.controller.post_create_token);
        this.router.get('/token',this.controller.get_create_token);
    }


}

const oauthRouter = new OauthRouter();
oauthRouter.init();

export default (oauthRouter.router);
