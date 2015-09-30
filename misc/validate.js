var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var request = require("request");
var logger = require("log4js").getLogger("sync");
require('require-all')(__dirname + '/../backend');
//{fileName : /testQuestion/}

domain.require(function(Draft, $watsonDocuments) {
   return $watsonDocuments().then(function(documents) {
      return Draft.find().all().then(function(drafts) {
         _.each(documents, function(document) {
            var found = false;
            _.each(drafts, function(draft) {
               if (draft.get("fileName") === document.fileName) {

                  found = true;
               }
            });
            if (found === false) {
               console.log(document.fileName, "was not found");
            }

         });
         //console.log(drafts)
      });
   });

}).then(function() {
   console.log("DONE");
});
