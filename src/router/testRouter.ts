import { Router } from 'express'
import { DBConection } from '../db'
import clientsDb from '../db/dbmock/client-db-mock';

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
                dbc.findCollection('colection',{}).then((e)=>res.status(200).send(e), (e)=>res.status(505).send(e));
                dbc.close()
            });
        });
        this.router.get('/db/:colec',(req,res)=>{
            DBConection.init().then((dbc)=>{
                dbc.findCollection(req.params.colec,{}).then((e)=>res.status(200).send(e), (e)=>res.status(505).send(e));
                dbc.close()
            });
        });
        this.router.get('/db/:colec/drop',(req,res)=>{
            DBConection.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec,{}).then((e)=>res.status(200).send(e), (e)=>res.status(505).send(e));
                dbc.close();
            }); 
        });
   
    }


}

const testRouter = new TestRouter();
testRouter.init();

export default (testRouter.router);
