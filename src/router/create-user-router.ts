import { Router } from 'express'
import { UserController } from '../controllers/user-controler'

export class CreateUserRouter {
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

    public static getRouter():Router {
       const createUser = new CreateUserRouter();
       createUser.init();
       return createUser.router;
    }
}

export default CreateUserRouter;
