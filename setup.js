var domain = require("wires-domain");
var Promise = require("promise");
var Model = require("wires-mongo");
var moment = require("moment");
require('require-all')(__dirname + '/backend');

domain.require(function(Group, User, Token) {
   var createRootGroup = function() {
      return Group.find({
         name: "root"
      }).first().then(function(record) {
         if (!record) {
            record = new Group({
               name: "root",
               permissions: {
                  root: true
               }
            });
            return record.save();
         }
         return record;
      });
   };

   var createAdminUser = function(group) {
      return User.find({
         email: "admin@morrr.com"
      }).first().then(function(user) {
         if (!user) {
            user = new User({
               name: "admin",
               email: "admin@wires-srv.com",
               password: "1qw23er4123",
               group: group
            });
            return user.save();
         }
         return user;
      });
   };

   createRootGroup().then(createAdminUser)
      .then(function(user) {
         console.log("all good", user);
      });

});
