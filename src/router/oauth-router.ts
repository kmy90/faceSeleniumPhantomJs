import { Router } from 'express'
import { OauthController } from '../controllers/oauth-controller'

export class OauthRouter {
    router: Router;
    controller: OauthController;

    constructor() {
        this.router = Router();
        this.controller = new OauthController();
        this.init();
    }

    init(){
        this.router.post('/token',this.controller.post_obtain_user_token);
        this.router.get('/token',this.controller.get_obtain_user_token);
        this.router.post('/token/admin',this.controller.post_obtain_admin_token);
        this.router.get('/token/admin',this.controller.get_obtain_admin_token);
    }


}

const oauthRouter = new OauthRouter();
oauthRouter.init();

export default (oauthRouter.router);
