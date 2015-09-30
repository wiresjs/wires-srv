var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var fs = require("fs");
domain.service("$copyFile", function() {
   return function(source, target, cb) {
      return new Promise(function(resolve, reject) {
         var cbCalled = false;

         var rd = fs.createReadStream(source);
         rd.on("error", function(err) {
            done(err);
         });
         var wr = fs.createWriteStream(target);
         wr.on("error", function(err) {
            done(err);
         });
         wr.on("close", function(ex) {
            done();
         });
         rd.pipe(wr);

         function done(err) {
            if (!cbCalled) {
               if (err) {
                  return reject(err);
               }
               cbCalled = true;
               return resolve();
            }
         }
      });
   };
});
