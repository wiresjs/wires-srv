var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');

var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');

//$userToken
domain.path("/image/:id",
   // Only super admins are allowed to go there
   {
      get: function() {

         if ($params.id) {
            return Token.find($params.id).required().first();
         }
         return Token.find().all();
      }
   }
);
