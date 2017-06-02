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
        this.router.get('/',this.controller.obtain_user_info);
    }

    public static getRouter() {
        const userRouter = new UserRouter();
        userRouter.init();
        return (userRouter.router);
    }
}
export default UserRouter;