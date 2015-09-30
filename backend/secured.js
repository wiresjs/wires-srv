var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');

domain.service("$secured", function($session) {
   var permissions = $session.session.get("user.group.permissions");
   if (!permissions) {
      throw {
         status: 400,
         message: "Not enough permissions!"
      };
   }

   if (!permissions.root) {
      throw {
         status: 400,
         message: "Not enough permissions!"
      };
   }
});
