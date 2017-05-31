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
        this.router.get('/db',(req,res)=>{

            DBConection.init().then((dbc)=>{
                dbc.insertCollectionOne('a',{a:'a'});
                dbc.findCollection('a', {}).then((e)=>res.status(200).send(e), (e)=>res.status(505).send(e));
            });
        });
    }


}

const testRouter = new TestRouter();
testRouter.init();

export default (testRouter.router);
