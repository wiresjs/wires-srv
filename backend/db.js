var domain = require("wires-domain");
var mongo = require('mongodb');
var Promise = require("promise");
var Connection;

var MONGO_DB_NAME = 'wires-srv';
var MONGO_PORT = process.env.MONGO_PORT || 27017;
var MONGO_URI = 'mongodb://localhost:' + MONGO_PORT + '/' + MONGO_DB_NAME;
if (process.env.MONGO_PORT_27017_TCP_ADDR) {
   MONGO_URI = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/' +
      MONGO_DB_NAME;
}
// Resolving connection
domain.service("$db", function() {

   return new Promise(function(resolve, reject) {
      if (Connection) {
         return resolve(Connection);
      }
      console.log(MONGO_URI);
      mongo.MongoClient.connect(MONGO_URI, {
         server: {
            auto_reconnect: true
         }
      }, function(err, _db) {
         if (err) {
            return reject(err);
         }
         Connection = _db;
         return resolve(Connection);
      });
   });
});
