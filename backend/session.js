var domain = require("wires-domain");
var Promise = require("promise");

domain.service("$session", function($res, $req, Session, User, Group) {
   var cookieNamename = "___session___";
   var session_id = $req.cookies[cookieNamename];

   // If session was already fetched withing this request
   if ($req.___session___)
      return $req.___session___;

   // Session object is going to be constructed when called
   return domain.Factory.extend({
      // Resolving current session
      init: function() {
         var self = this;
         return new Promise(function(resolve, reject) {
            if (session_id) {
               new Session().find({
                     session_id: session_id
                  })
                  // Join user and group within
                  .with("user", User.with("group", Group))
                  .first().then(function(session) {
                     self.session = session;
                     $req.___session___ = self;
                     return resolve(session);
                  });
            } else {
               resolve();
            }
         });
      },

      isValid: function() {
         return this.session !== undefined && this.session !== null;
      },

      // Generating new session
      generate: function(user) {
         var sess = new Session();
         sess.generate();
         sess.set("user", user);
         $res.cookie(cookieNamename, sess.get("session_id"));
         this.session = sess;
         return sess.save();
      },
      // Removing sessions
      remove: function() {

         var self = this;
         return new Promise(function(resolve, reject) {
            if (self.session) {
               return resolve(self.session.remove());
            }
            return resolve({
               success: 1
            });
         });
      }
   });
});
