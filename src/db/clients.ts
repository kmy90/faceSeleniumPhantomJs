import clientsDb from './dbmock/client-db-mock';

export class ClienatDB {

    constructor(){}

    public static findById(id, done):any {
      for (let i = 0, len = clientsDb.length; i < len; i++) {
        if (clientsDb[i].id === id) return done(null, clientsDb[i]);
      }
      return done(new Error('Client Not Found'));
    }

    public static findByClientId(clientId, done):any {
      for (let i = 0, len = clientsDb.length; i < len; i++) {
        if (clientsDb[i].clientId === clientId) return done(null, clientsDb[i]);
      }
      return done(new Error('Client Not Found'));
    }

}
