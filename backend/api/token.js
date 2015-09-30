var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');

var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');

domain.path("/api/token/:id?",
   // Only super admins are allowed to go there
   function($next, $secured) {
      $next();
   }, {
      get: function($params, Token) {

         if ($params.id) {
            return Token.find($params.id).required().first();
         }
         return Token.find().all();
      },
      post: function($body, Token) {
         return new Token($body).save();
      },
      put: function($params, $body, Token) {
         return Token.find($params.id)
            .required().first().then(function(conf) {
               return conf.set($body.attrs).save();
            });
      },
      delete: function($params, Token) {
         return Token.find($params.id)
            .required().first().then(function(conf) {
               return conf.remove();
            });
      }
   });
