"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const database_config_1 = require("../config/database-config");
class DataBaseConection {
    constructor(db) {
        this.db = db;
    }
    // Insert some documents
    insertCollectionOne(collection, obj) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).insertOne(obj, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolver(result);
                }
            });
        });
    }
    // Insert some documents
    insertCollectionMay(collection, objs) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).insertMany(objs, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolver(result);
                }
            });
        });
    }
    // Find some documents
    findCollectionMany(collection, query) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).find(query).toArray((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolver(docs);
                }
            });
        });
    }
    // Find some documents
    findCollectionOne(collection, query) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).find(query).toArray((err, docs) => {
                if (err) {
                    reject(err);
                }
                else if (docs.length > 0) {
                    resolver(docs[0]);
                }
                else {
                    resolver(null);
                }
            });
        });
    }
    // Find some documents
    findOneUpdate(collection, query, update) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).findOneAndUpdate(query, { $set: update }, (err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolver(docs.value);
                }
            });
        });
    }
    // Update document
    updateCollectionOne(collection, query, update) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).updateOne(query, { $set: update }, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolver(result);
                }
            });
        });
    }
    // Update document
    updateCollectionMany(collection, query, update) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).updateMany(query, { $set: update }, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolver(result);
                }
            });
        });
    }
    removeCollectionOne(collection, query) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).deleteOne(query, (err, result) => {
                resolver(result);
            });
        });
    }
    removeCollectionMany(collection, query) {
        return new Promise((resolver, reject) => {
            this.db.collection(collection).deleteMany(query, (err, result) => {
                resolver(result);
            });
        });
    }
    close() {
        return new Promise((resolver, reject) => {
            this.db.close();
        });
    }
    static init() {
        return new Promise((resolver, reject) => {
            mongodb_1.MongoClient.connect(database_config_1.default.urlConect, (err, db) => {
                if (err)
                    reject(err);
                resolver(new DataBaseConection(db));
            });
        });
    }
}
exports.DataBaseConection = DataBaseConection;
exports.default = DataBaseConection;
