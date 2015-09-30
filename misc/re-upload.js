var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var request = require("request");
var logger = require("log4js").getLogger("sync");
require('require-all')(__dirname + '/../backend');
//{fileName : /testQuestion/}

domain.require(function(Draft, $syncDraft) {
   return Draft.find({
      fileName: /question0012/
   }).all().then(function(drafts) {
      return domain.each(drafts, function(draft) {
         return $syncDraft(draft);
      });
   });
}).then(function() {
   console.log("DONE");
});
