import { DBConection } from '../db'
const CLIENT_COLECTION = 'client';
export class ClienatDB {

    constructor(){}

    public static findById(id):Promise<any> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollection(CLIENT_COLECTION,{ id:id }).then((clientsDb) => {
          for (let i = 0, len = clientsDb.length; i < len; i++) {
            if (clientsDb[i].id === id) return resolve(clientsDb[i]);
          }
          resolve(null);
        },reject);
      },reject));
    }

    public static findByClientId(clientId):Promise<any> {
      return new Promise((resolve, reject) =>
      DBConection.init().then((dbc) => {
        dbc.findCollection(CLIENT_COLECTION,{ clientId: clientId }).then((clientsDb) => {
          for (let i = 0, len = clientsDb.length; i < len; i++) {
           if (clientsDb[i].clientId === clientId) return resolve(clientsDb[i]);
          }
          resolve(null);
        },reject);
      },reject));
    }

}
