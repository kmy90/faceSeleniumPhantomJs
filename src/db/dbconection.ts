import { MongoClient } from 'mongodb';
import ConfigDB from './config_db';

export class DBConection {
  db:any;

  constructor(db:any) {
    this.db = db;
  }

  public insertCollectionOne(collection, obj):Promise<any> {
    return new Promise((resolver,reject) => {
      // Insert some documents
      this.db.collection(collection).insertOne(obj ,(err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolver(result);
      });
    });
  }

  public insertCollectionMay(collection, obj):Promise<any> {
    return new Promise((resolver,reject) => {
      // Insert some documents
      this.db.collection(collection).insertMany(obj ,(err, result) => {
        if(err) {
          reject(err);
          return;
        }
        resolver(result);
      });
    });
  }

  public findCollection(collection, query):Promise<any> {
    return new Promise((resolver,reject) => {
      // Find some documents
      this.db.collection(collection).find(query).toArray((err, docs) => {
        if(err) {
          reject(err);
          return;
        }
        resolver(docs);
      });
    });
  }

  public findCollectionUpdate(collection, query, update):Promise<any> {
    return new Promise((resolver,reject) => {
      // Find some documents
      this.db.collection(collection).findOneAndUpdate(query,update).toArray((err, docs) => {
        if(err) {
          reject(err);
          return;
        }
        resolver(docs);
      });
    });
  }

  public updateCollectionOne(collection, query,update):Promise<any> {
    return new Promise((resolver,reject) => {
      // Update document where a is 2, set b equal to 1
      this.db.collection(collection).updateOne(query, { $set: update }, (err, result) => {
        console.log("Updated");
        if(err) {
          reject(err);
          return;
        }
        resolver(result);
      });
    });
  }

  public updateCollectionMany(collection, query,update):Promise<any> {
    return new Promise((resolver,reject) => {
      // Update document where a is 2, set b equal to 1
      this.db.collection(collection).updateMany(query, { $set: update }, (err, result) => {
        console.log("Updated");
        if(err) {
          reject(err);
          return;
        }
        resolver(result);
      });
    });
  }

  public removeCollectionOne(collection, query):Promise<any> {
    return new Promise((resolver,reject) => {
      this.db.collection(collection).deleteOne(query, (err, result) => {
        resolver(result);
      });
    });
  }

  public removeCollectionMany(collection, query):Promise<any> {
    return new Promise((resolver,reject) => {
      this.db.collection(collection).deleteMany(query, (err, result) => {
        resolver(result);
      });
    });
  }

  public close():any {
    return new Promise((resolver,reject) => {
      this.db.close();
    });
  }
  public static init():Promise<DBConection> {
    return new Promise((resolver,reject)=>{
      MongoClient.connect(ConfigDB.urlConect,(err, db) => {
        if(err) reject(err);
        resolver(new DBConection(db));
      });
    });
  
  }

}