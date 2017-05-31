import { MongoClient } from 'mongodb';
import ConfigDB from './config_db';

const url = ConfigDB.urlConect;

export class DBConection {
  db:any;

  constructor(db:any) {
    this.db = db;
  }

  public insertCollectionOne(collection, obj):Promise<any> {
    return new Promise((resolver,reject) => {
      console.log("insertCollection {");
      let { db } = this;
      if(!db) { 
        reject(new Error('Not conection')); 
        return;
      }
      // Get the documents collection
      let collectionDb = db.collection(collection);
      // Insert some documents
      collectionDb.insertOne( obj ,(err, result) => {
        if(err) {
          reject(err);
          return;
        }
        console.log("Inserted documents");
        resolver(result);
      });
      console.log("insertCollection }");
    });
  }

  public findCollection(collection, query):Promise<any> {
    return new Promise((resolver,reject) => {
      console.log("findCollection {");
      let { db } = this;
      if(!db) { 
        reject(new Error('Not conection')); 
        return;
      }
      // Get the documents collection
      let collectionDb = db.collection(collection);
      // Find some documents
      collectionDb.find(query).toArray((err, docs) => {
        if(err) {
          reject(err);
          return;
        }
        console.log("Found the following records");
        resolver(docs);
      });
      console.log("findCollection }");
    });
  
  }

  public updateCollectionOne(collection, query,update):Promise<any> {
    return new Promise((resolver,reject) => {
      console.log("updateCollectionOne {");
      let { db } = this;
      if(!db) { 
        reject(new Error('Not conection')); 
        return;
      }
      // Get the documents collection
      let collectionDb = db.collection(collection);
      // Update document where a is 2, set b equal to 1
      collectionDb.updateOne(query, { $set: update }, (err, result) => {
        if(!err) {
          reject(err);
          return;
        }
        console.log("Updated");
        resolver(result);
      });
      console.log("updateCollectionOne }");
    });
  }

  public removeCollectionOne(collection, query):Promise<any> {
    return new Promise((resolver,reject) => {
      console.log("removeDocumentOne {");
      let { db } = this;
       if(!db) { 
        reject(new Error('Not conection')); 
        return;
      }
      // Get the documents collection
      let collectionDb = db.collection('collection');
      // Delete document where a is 3
      collectionDb.deleteOne(query, (err, result) => {
        console.log("Removed the document with the field a equal to 3");
        resolver(result);
      });
      console.log("removeDocumentOne }");
    });
  }

  public close():Promise<any> {
    return new Promise((resolver,reject)=>{
       if(!this.db) { 
        reject(new Error('Not conection')); 
        return;
      }
      this.db.close();
      this.db = null;
      resolver();
    })
  }

  public static init():Promise<any> {
    return new Promise((resolver,reject)=>{
      console.log("init {");
      MongoClient.connect(url,(err, db) => {
        if(err) reject(err);
        console.log("Connected successfully to server");
        resolver(new DBConection(db));
      });
      console.log("init }");
    });
  
  }

}