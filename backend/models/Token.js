var domain = require("wires-domain");
var Model = require("wires-mongo");
var sha1 = require("sha1");

domain.service("Token", function() {
   var Token = Model.extend({
      collection: "token",
      schema: {
         _id: [],
         hash: {
            defaults: function() {
               var salt = new Date().getTime() + "-" + Math.random() + "-" + Math.random();
               return sha1(salt);
            }
         },
         tag: {
            required: true
         },
         created_at: {
            defaults: function() {
               return new Date();
            }
         }
      }
   });
   return Token;
});
