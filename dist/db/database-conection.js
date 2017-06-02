"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const database_config_1 = require("../config/database-config");
class DataBaseConection {
    constructor(db) {
        this.db = db;
    }
    insertCollectionOne(collection, obj) {
        return new Promise((resolver, reject) => {
            // Insert some documents
            this.db.collection(collection).insertOne(obj, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolver(result);
            });
        });
    }
    insertCollectionMay(collection, obj) {
        return new Promise((resolver, reject) => {
            // Insert some documents
            this.db.collection(collection).insertMany(obj, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolver(result);
            });
        });
    }
    findCollection(collection, query) {
        return new Promise((resolver, reject) => {
            // Find some documents
            this.db.collection(collection).find(query).toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolver(docs);
            });
        });
    }
    findOneUpdate(collection, query, update) {
        return new Promise((resolver, reject) => {
            // Find some documents
            this.db.collection(collection).findOneAndUpdate(query, { $set: update }, (err, docs) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolver(docs.value);
            });
        });
    }
    updateCollectionOne(collection, query, update) {
        return new Promise((resolver, reject) => {
            // Update document where a is 2, set b equal to 1
            this.db.collection(collection).updateOne(query, { $set: update }, (err, result) => {
                console.log("Updated");
                if (err) {
                    reject(err);
                    return;
                }
                resolver(result);
            });
        });
    }
    updateCollectionMany(collection, query, update) {
        return new Promise((resolver, reject) => {
            // Update document where a is 2, set b equal to 1
            this.db.collection(collection).updateMany(query, { $set: update }, (err, result) => {
                console.log("Updated");
                if (err) {
                    reject(err);
                    return;
                }
                resolver(result);
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
