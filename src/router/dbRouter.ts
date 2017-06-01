import { Router } from 'express'
import { DBConection } from '../db'
import clientsDb from '../db/dbmock/client-db-mock';

export class DBRouter {
    router: Router;


    constructor() {
        this.router = Router();
        this.init();
    }

    init(){
        this.router.get('/:colec',(req,res)=>{
            DBConection.init().then((dbc)=>{
                dbc.findCollection(req.params.colec,{}).then((e)=>res.status(200).send(e), (e)=>res.status(505).send(e));
                dbc.close()
            });
        });
        this.router.post('/:colec',(req,res)=>{
            DBConection.init().then((dbc)=>{
                dbc.insertCollectionOne(req.params.colec, req.body).then((e)=>res.status(200).send(e), (e)=>res.status(505).send(e));
                dbc.close()
            });
        });
        this.router.get('/:colec/drop',(req,res)=>{
            DBConection.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec,{}).then((e)=>res.status(200).send(e), (e)=>res.status(505).send(e));
                dbc.close();
            }); 
        });
   
    }


}

const dbRouter = new DBRouter();
dbRouter.init();

export default (dbRouter.router);
