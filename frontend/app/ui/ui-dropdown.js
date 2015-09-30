domain.service("components.ui-dropdown", ['Controller', '$pathObject'], function(Controller, $pathObject) {
   return Controller.extend({
      _view: "ui/ui-dropdown.html",
      initialize: function(attrs) {
         this.target = attrs.target;
         this.key = "name";
         if (attrs.key) {
            this.key = attrs.key.initialValue.str;
         }
         if (attrs.placeholder) {
            this.placeholder = attrs.placeholder.initialValue.str;
         }
         if (attrs.target) {
            this.targetKey = attrs.target.initialValue.str;
         }
         if (attrs.selected) {
            var _locals = attrs.selected.attr.vars;
            if (_locals.__v0) {
               var selectedPath = _locals.__v0.p;
               if (attrs.selected.initialValue.locals && attrs.selected.initialValue.locals[0]) {
                  this.targetValue = attrs.selected.initialValue.locals[0];
               }
            }
         }
         if (attrs.icon) {
            this.icon = attrs.icon.initialValue.str;
         }
         this.items = attrs.items.getVariableValue();
         _.bindAll(this);
      },
      // Detecting is current value is the one we want to display as "selected"
      isSelected: function(item) {
         if (this.targetValue) {
            if (this.targetKey) {
               if (_.isEqual(this.targetValue.value.value, item[this.targetKey])) {
                  this.selectedItem = item[this.key];
               }
            } else {
               if (_.isEqual(this.targetValue.value.value, item)) {
                  this.selectedItem = item[this.key];
               }
            }
         }
      },
      menuClicked: function(target, event) {

         var clickedTarget = event.target;

         if ($(clickedTarget).hasClass("item")) {
            var boundValue = clickedTarget.$tag.scope.item;
            //console.log(boundValue.hash);
            this.targetValue.value.update(this.targetKey ? boundValue[this.targetKey] : boundValue);
            this.selectedItem = boundValue[this.key];
         }

         var el = $(target.element).find(".menu");
         var status = $(el).css("display");
         var duration = 100;
         if (status === "none") {

            el.fadeIn({
               duration: duration,
               queue: false
            }).css('display', 'none').slideDown(duration);
            // el.show().velocity("slideDown", {
            //    duration: 100
            // });
         } else {
            el.stop(true, true).fadeOut({
               duration: duration,
               queue: false
            }).slideUp(duration);
            // el.velocity("slideUp", {
            //    duration: 100
            // });
         }

      },
      getValue: function(item) {
         return {
            $watch: this.key,
            $scope: item
         };
      }
   });
});
