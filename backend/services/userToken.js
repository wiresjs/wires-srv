var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');

domain.service("$userToken", function($body, $query, $assert, Token) {
   var token = $body.attrs.token || $query.attrs.token;
   if (!token) {
      return $assert.bad_request("Token must be specifiied!");
   }
   return Token.find({
      hash: token
   }).required("Token was not found").first();
});
