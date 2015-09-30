var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');

domain.service("$str", function() {
   return function(str, dict) {
      _.each(dict, function(v, k) {
         str = str.split("$" + k).join(v);
      });
      return str;
   };
});
