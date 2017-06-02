import { Router } from 'express'
import { UserController } from '../controllers/user-controler'

export class OauthRouter {
    router: Router;
    controller: UserController;

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.init();
    }

    init(){
        this.router.post('/',this.controller.create_user);
    }


}

const oauthRouter = new OauthRouter();
oauthRouter.init();

export default (oauthRouter.router);
