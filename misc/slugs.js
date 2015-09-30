var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
require('require-all')(__dirname + '/../backend');
domain.require(function(Answer) {
   return Answer.find().all().then(function(data) {
      return domain.each(data, function(item) {
         return item.save();
      });
   });

}).then(function(items) {
   console.log("all done", items);
   process.exit();
});
