var domain = require("wires-domain");
var Model = require("wires-mongo");
var passwordHash = require('password-hash');

var User;

domain.service("User", function() {
   var User = Model.extend({
      collection: "user",
      schema: {
         _id: [],
         name: {
            required: true
         },
         email: {
            required: true
         },
         password: {
            hidden: true
         },
         group: {
            required: true,
            reference: true
         },
         session_id: {}
      },
      // Checking email and password
      // Resolving new user model
      login: function(email, password) {
         return domain.promise(function(resolve, reject) {

            new User().find({
               email: email
            }).first().then(function(record) {
               if (!record) {

                  return reject({
                     status: 400,
                     message: "Combination was not found"
                  });
               }
               var validPassword = passwordHash.verify(password, record.get("password"));
               if (validPassword) {
                  return resolve(record);
               } else {
                  return reject({
                     status: 400,
                     message: "Password rejected"
                  });
               }
            });
         });
      },

      // Ensures email is unique
      _validateEmail: function(resolve, reject) {
         // Validating existing user
         var criterion = {
            $and: [{
               email: this.attrs.email
            }]
         };
         if (this.attrs._id) {
            criterion.$and.push({
               _id: {
                  $ne: this.attrs._id
               }
            });
         }

         return new User().find(criterion).count().then(function(rows) {
            if (rows > 0) {
               return reject({
                  code: 400,
                  message: "Email is already in the database"
               });
            }
            return resolve();
         });
      },
      // If password is present
      // We check if it's hashed, if not - hash it
      _hashPassword: function() {
         if (this.attrs.password) {
            if (!passwordHash.isHashed(this.attrs.password)) {
               this.attrs.password = passwordHash.generate(this.attrs.password);
            }
         }
      },
      onBeforeUpdate: function(resolve, reject) {
         // Password is not required on update
         // But we check if update required
         this._hashPassword();
         return this._validateEmail(resolve, reject);
      },
      // Validations before saving to database
      onBeforeCreate: function(resolve, reject) {
         if (!this.attrs.password) {
            return reject({
               status: 400,
               message: "Password is required"
            });
         }
         this._hashPassword();
         return this._validateEmail(resolve, reject);
      }
   });
   return User;
});
