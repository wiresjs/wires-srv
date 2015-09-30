domain.service("Modal", ['Controller'], function(Controller) {
   return Controller.extend({
      _view: "utils/modal.html -> .modal-placeholder",
      initialize: function(data) {
         this.data = data || {};

      },
      show: function(renderable) {
         this.render();
         if (renderable) {
            renderable.render(".inner-modal-content");

            this.renderable = renderable;
            this.renderable.__modal = this;
         }
      },
      cancel: function() {
         if (this.renderable && this.renderable.__cancel) {
            this.renderable.__cancel();
         }
         this.destroy();
      },
      okay: function() {
         if (this.renderable && this.renderable.__okay) {
            this.renderable.__okay();
         }
      }
   });
});
