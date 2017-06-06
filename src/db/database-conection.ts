import { MongoClient, ObjectId } from 'mongodb';
import ConfigDB from '../config/database-config';

export class DataBaseConection {
  db:any;

  constructor(db:any) {
    this.db = db;
  }
  // Insert some documents
  public insertCollectionOne(collection:string, obj:any):Promise<any> {
    return new Promise((resolver,reject) => {
      this.db.collection(collection).insertOne(obj ,(err, result) => {
        if(err) {
          reject(err);
        } else {
          resolver(result);
        }       
      });
    });
  }

  // Insert some documents
  public insertCollectionMay(collection:string, objs:any[]):Promise<any> {
    return new Promise((resolver,reject) => {
      this.db.collection(collection).insertMany(objs ,(err, result) => {
        if(err) {
          reject(err);
        } else {
          resolver(result);
        }
      });
    });
  }

  // Find some documents
  public findCollectionMany(collection:string, query:any):Promise<any> {
    if(query._id) query._id = new ObjectId(query._id);
    return new Promise((resolver,reject) => {
      this.db.collection(collection).find(query).toArray((err, docs) => {
        if(err) {
          reject(err);
        } else {
          resolver(docs); 
        }
       
      });
    });
  }

  // Find some documents
  public findCollectionOne(collection:string, query:any):Promise<any> {
    if(query._id) query._id = new ObjectId(query._id);
    return new Promise((resolver,reject) => {
      this.db.collection(collection).find(query).toArray((err, docs) => {
        if(err) {
          reject(err);
        } else if(docs.length > 0) { 
          resolver(docs[0]);
        } else {
          resolver(null);
        }

      });
    });
  }

  // Find some documents
  public findCollectionOneById(collection:string, id:string):Promise<any> {
    return new Promise((resolver,reject) => {
      this.db.collection(collection).find({ _id:new ObjectId(id) }).toArray((err, docs) => {
        if(err) {
          reject(err);
        } else if(docs.length > 0) { 
          resolver(docs[0]);
        } else {
          resolver(null);
        }

      });
    });
  }

 // Find some documents
  public findOneUpdate(collection:string, query:any, update:any):Promise<any> {
    if(query._id) query._id = new ObjectId(query._id);
    return new Promise((resolver,reject) => {
      this.db.collection(collection).findOneAndUpdate(query, { $set: update }, (err, docs) => {
        if(err) {
          reject(err);
        } else {
         resolver(docs.value);
        }
      });
    });
  }

  // Update document
  public updateCollectionOne(collection:string, query:any, update:any):Promise<any> {
    if(query._id) query._id = new ObjectId(query._id);
    return new Promise((resolver,reject) => {
      this.db.collection(collection).updateOne(query, { $set: update }, (err, result) => {
        if(err) {
          reject(err);
        } else {
          resolver(result);
        }
      });
    });
  }

  // Update document
  public updateCollectionMany(collection:string, query:any, update:any):Promise<any> {
    if(query._id) query._id = new ObjectId(query._id);
    return new Promise((resolver,reject) => {
      this.db.collection(collection).updateMany(query, { $set: update }, (err, result) => {
        if(err) {
          reject(err);
        } else {
          resolver(result);
        }
      });
    });
  }

  public removeCollectionOne(collection:string, query:any):Promise<any> {
    if(query._id) query._id = new ObjectId(query._id);
    return new Promise((resolver,reject) => {
      this.db.collection(collection).deleteOne(query, (err, result) => {
        if(err) {
          reject(err)
        } else {
          resolver(result);
        }
      });
    });
  }

  public removeCollectionMany(collection:string, query:any):Promise<any> {
    if(query._id) query._id = new ObjectId(query._id);
    return new Promise((resolver,reject) => {
      this.db.collection(collection).deleteMany(query, (err, result) => {
        resolver(result);
      });
    });
  }

  public close():Promise<any> {
    return new Promise((resolver,reject) => {
      this.db.close();
    });
  }
  public static init():Promise<DataBaseConection> {
    return new Promise((resolver,reject)=>{
      MongoClient.connect(ConfigDB.urlConect,(err, db) => {
        if(err) reject(err);
        resolver(new DataBaseConection(db));
      });
    });
  
  }
}
export default DataBaseConection;