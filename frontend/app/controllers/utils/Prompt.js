domain.service("PromptController", ['Controller'], function(Controller) {
   return Controller.extend({
      _view: "utils/prompt.html -> body",
      initialize: function(yes, no) {
         this.yesCallback = yes;
         this.noCallback = no;
      },
      yes: function() {
         this.yesCallback();
      },
      no: function() {
         this.destroy();
         this.noCallback();
      }
   });
});

domain.service("Prompt", ['PromptController'], function(PromptController) {
   return function(message, onyes) {
      var prmt = new PromptController(function() {
         onyes();
         prmt.destroy();
      }, function() {
         // No
      });
      prmt.header = message;
      prmt.render();
   };
});
