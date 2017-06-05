import { Router } from 'express'
import { OauthController } from '../controllers/oauth-controller'
import * as passport from 'passport';


export class OauthRouter {
    router: Router;
    controller: OauthController;

    constructor() {
        this.router = Router();
        this.controller = new OauthController();
        this.init();
    }

    init(){
        this.router.delete('/token',this.controller.clean_user_token);
        this.router.post('/token', this.controller.obtain_user_token);
        this.router.post('/token/admin',this.controller.obtain_admin_token);
        this.router.get('/token/admin', passport.authenticate('basic-admin',{ session: false })
            , this.controller.obtain_admin_token);
        this.router.delete('/token/admin', passport.authenticate('basic-admin',{ session: false })
            , this.controller.clean_admin_token);
    }

    public static getRouter():Router {
        const oauthRouter = new OauthRouter();
        oauthRouter.init();
        return (oauthRouter.router);
    }

}

export default OauthRouter;