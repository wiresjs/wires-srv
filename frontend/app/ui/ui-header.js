domain.service("components.ui-header", ['Controller'], function(Controller) {
   return Controller.extend({
      _view: "ui/ui-header.html",
      initialize: function(attrs) {
         this.header = attrs.text.initialValue.str;
      }
   });
});
