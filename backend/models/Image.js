var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var Model = require("wires-mongo");

domain.service("Image", function() {
   var Token = Model.extend({
      collection: "image",
      schema: {
         _id: {},
         name: {
            index: true
         },
         meta: {},
         project: {
            required: true,
            index: true
         },
         token: {
            required: true,
            reference: true
         },
         folder: {
            required: true,
            index: true
         },
         processed: {
            defaults: []
         },
         publicPath: {},
         created_at: {
            defaults: function() {
               return new Date();
            }
         }
      }
   });
   return Token;
});
