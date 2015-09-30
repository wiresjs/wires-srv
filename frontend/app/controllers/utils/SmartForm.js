domain.service("SmartForm", ['Controller', '$form'], function(Controller, $form) {
   return Controller.extend({
      _view: "utils/smart_form.html -> body",
      initialize: function(data) {
         this.data = data || $form();
         this.fields = [];
      },
      _bind: function(name) {
         return {
            $watch: name,
            $scope: this.data
         };
      },
      __okay: function() {
         var self = this;
         if (self._submit_callback) {
            var res = self._submit_callback(self.data);
            if (res) {
               res.then(function() {
                  self.destroy();
                  if (self.__modal) {
                     self.__modal.destroy();
                  }
               });
            } else {
               self.destroy();
               if (self.__modal) {
                  self.__modal.destroy();
               }
            }
         }
      },
      __cancel: function() {
         this.destroy();
      },
      submit: function(cb) {
         this._submit_callback = cb;
      },
      setTitle: function(title) {
         this.title = title;
      },
      add: function() {
         var self = this;
         var amount = arguments.length;
         var _class = "ten";
         switch (amount) {
            case 2:
               _class = "nine";
               break;
            case 3:
               _class = "eight";
               break;
            case 4:
               _class = "seven";
               break;
            case 5:
               _class = "six";
               break;
         }
         var items = [];
         _.each(arguments, function(item) {
            item.cls = _class;
            if (item.type === "input") {
               items.push(item);
            }
         });
         self.fields.push(items);
      },
   }, {
      // Static methods
      input: function(name, placeholder) {
         return {
            type: "input",
            name: name,
            placeholder: placeholder
         };
      }
   });
});
