import { Router } from 'express'

export class TestRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init(){
        this.router.post('/',(req,res)=>{
            console.log(req.body);
            res.status(200).send('OK')
        });
        this.router.get('/',(req,res)=>{
            console.log(req.body);
            res.status(200).send('OK')
        });
    }

    public static getRuter():Router {
       const testRouter = new TestRouter();
       testRouter.init();
       return testRouter.router;
    }
}

export default TestRouter;
