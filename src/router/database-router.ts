import { Router, Request, Response } from 'express'
import DBConection from '../db/database-conection'

export class DataBaseRouter {
    router: Router;


    constructor() {
        this.router = Router();
        this.init();
    }

    init(){
        this.router.get('/:colec',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                dbc.findCollectionMany(req.params.colec,{}).then(
                    (e)=>res.status(200).send(e),
                    (e)=>res.status(505).send(e)
                );
                dbc.close()
            });
        });
        this.router.post('/:colec',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                dbc.insertCollectionMay(req.params.colec, req.body).then(
                    (e)=>res.status(201).send(e),
                    (e)=>res.status(505).send(e)
                );
                dbc.close()
            });
        });
        this.router.post('/:colec/one',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                dbc.insertCollectionMay(req.params.colec, req.body).then(
                    (e)=>res.status(201).send(e),
                    (e)=>res.status(505).send(e)
                );
                dbc.close()
            });
        });
        this.router.delete('/:colec',(req:Request, res:Response)=>{
            DBConection.init().then((dbc) => {
                dbc.removeCollectionMany(req.params.colec,{}).then(
                    (e)=>res.status(200).send(e),
                    (e)=>res.status(505).send(e)
                );
                dbc.close();
            }); 
        });
        this.router.post('/:colec/querry',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                dbc.findCollectionMany(req.params.colec, req.body).then(
                    (e) => res.status(200).send(e),
                    (e) => res.status(505).send(e)
                );
                dbc.close()
            });
        });
        this.router.delete('/:colec/querry',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                dbc.removeCollectionMany(req.params.colec, req.body).then(
                    (e) => res.status(200).send(e),
                    (e) => res.status(505).send(e)
                );
                dbc.close()
            });
        });
        this.router.put('/:colec/querry',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                if(!req.body.querry) {
                    res.status(505).send('Need Params "querry" and "new"');
                } else {
                    dbc.updateCollectionMany(req.params.colec, req.body.querry, req.body.new).then(
                        (e) => res.status(200).send(e),
                        (e) => res.status(505).send(e)
                    );
                }
                dbc.close()
            });
        });
        this.router.post('/:colec/querry/one',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                dbc.findCollectionOne(req.params.colec, req.body).then(
                    (e) => res.status(200).send(e),
                    (e) => res.status(505).send(e)
                );
                dbc.close()
            });
        });
        this.router.delete('/:colec/querry/one',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                dbc.removeCollectionOne(req.params.colec, req.body).then(
                    (e) => res.status(200).send(e),
                    (e) => res.status(505).send(e)
                );
                dbc.close()
            });
        });
        this.router.put('/:colec/querry/one',(req:Request, res:Response)=>{
            DBConection.init().then((dbc)=>{
                if(!req.body.querry) {
                    res.status(505).send('Need Params "querry" and "new"');
                } else {
                    dbc.updateCollectionOne(req.params.colec, req.body.querry, req.body.new).then(
                        (e) => res.status(200).send(e),
                        (e) => res.status(505).send(e)
                    );
                }
                dbc.close()
            });
        });
    }

    public static getRouter():Router{
        const dbRouter = new DataBaseRouter();
        dbRouter.init();
        return (dbRouter.router);
    }
}

export default DataBaseRouter;
