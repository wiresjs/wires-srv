var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var request = require("request");
var logger = require("log4js").getLogger("sync");
require('require-all')(__dirname + '/../backend');
//{fileName : /testQuestion/}

domain.require(function($watsonApi) {
   return $watsonApi.ask({
      q: "How do you get a bitch pregnant?"
   });
}).then(function(data) {
   console.log("DONE", data);
});
