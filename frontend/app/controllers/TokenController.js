domain.service("controllers.TokenController", ['Controller', '$resource', '$array', '$form', 'SmartForm', 'Modal',
      'Prompt'
   ],
   function(Controller, $resource, $array, $form, SmartForm, Modal, Prompt) {

      return Controller.extend({
         _view: "tokens.html",
         initialize: function() {

            this.tokens = $array({
               endpoint: "/api/token/:_id"
            });
            this.form = $form();
            this.tokens.$fetch();

         },
         removeToken: function(token) {
            Prompt("Are you sure you want to remove it?", function() {
               token.$remove();
            });
         },
         _createForm: function(data) {
            var sm = new SmartForm(data);
            sm.setTitle("Add new token");
            sm.add(
               SmartForm.input("tag", "Tag")
            );
            return sm;
         },
         edit: function(_token) {
            var self = this;
            var sm = self._createForm(_token);
            sm.submit(function(token) {
               return token.$update();
            });
            var modal = new Modal();
            modal.header = "Edit Token";
            modal.show(sm);
         },
         showAddTokenModal: function() {
            var self = this;
            var sm = self._createForm();
            sm.submit(function(form) {
               return self.tokens.$add(form);
            });
            var modal = new Modal();
            modal.header = "Add Token";
            modal.show(sm);
         }
      });
   });
