import { Router } from 'express'
import { UserController } from '../controllers/user-controler'

export class UserRouter {
    router: Router;
    controller: UserController;

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.init();
    }

    init(){
        this.router.get('/', this.controller.obtain_user_info);
        this.router.get('/rest/password', this.controller.change_user_pass);
        this.router.get('/rest/secret_code', this.controller.change_user_secret);
    }

    public static getRouter() {
        const userRouter = new UserRouter();
        userRouter.init();
        return (userRouter.router);
    }
}
export default UserRouter;