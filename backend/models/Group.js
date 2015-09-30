var domain = require("wires-domain");
var Model = require("wires-mongo");
var passwordHash = require('password-hash');

var User;
domain.service("Group", function() {
   var Group = Model.extend({
      collection: "group",
      schema: {
         _id: [],
         name: {
            required: true
         },
         permissions: {},
      }
   });
   return Group;
});
