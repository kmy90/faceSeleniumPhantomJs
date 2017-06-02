import { Router } from 'express'
import { DBConection } from '../db'

export class TestRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init(){
        this.router.post('/post',(req,res)=>{
            res.status(200).send('OK')
        });
        this.router.get('/get',(req,res)=>{
            res.status(200).send('OK')
        });
    }
}

const testRouter = new TestRouter();
testRouter.init();

export default (testRouter.router);
