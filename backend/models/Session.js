var domain = require("wires-domain");
var Model = require("wires-mongo");
var sha1 = require('sha1');

var User;
domain.service("Session", function() {
   var Session = Model.extend({
      collection: "session",
      schema: {
         _id: [],
         session_id: {
            required: true
         },
         user: {
            required: true,
            reference: true
         }
      },
      // generates session id
      generate: function() {
         var salt = new Date().getTime() + "-" + Math.random() + "-" + Math.random();
         this.set("session_id", sha1(salt));
      }
   });
   return Session;
});
