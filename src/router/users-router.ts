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
    }
}

const usersRouter = new UsersRouter();
usersRouter.init();

export default (usersRouter.router);
