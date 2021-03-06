import { Router } from 'express'
import { UserController } from '../controllers/user-controler'

export class UsersRouter {
    router: Router;
    controller: UserController;

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.init();
    }

    init(){
        this.router.post('/',this.controller.create_user);
        this.router.delete('/',this.controller.delete_user);
        this.router.get('/',this.controller.obtain_users_info); 
    }

    public static getRouter():Router{
        const usersRouter = new UsersRouter();
        usersRouter.init();
        return (usersRouter.router);
    }
}

export default UsersRouter;
