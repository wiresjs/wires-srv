domain.service("components.ui-editor", ['Controller'], function(Controller) {
   return Controller.extend({
      _view: "ui/ui-editor.html",
      initialize: function(attrs) {
         if ( attrs.content){
            var variable;
            if( (variable = attrs.content.initialValue.locals[0])) {
               this._instance = variable.value.instance;
               this._property = variable.value.property;

            }
         }

         if ( attrs.target){
            var targetVariable;
            if( (targetVariable = attrs.target.initialValue.locals[0])) {
               this.targetVariable = targetVariable.value;
            }
         }

         this.toolbar = [
            'h3',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'orderedlist',
            'unorderedlist',
            'blockquote',
            'link',
            'unlink',
            'image'
         ];
      },
      onValue : function(value){
         this.editor.setValue(value);
      },
      onRender : function(){
         var self = this;
         this.editor = new SaneEditor(this.stack.element, {
             toolbar: this.toolbar
         });
         this.editor.onChange(function(value){
            if( self.targetVariable ){
                self.targetVariable.update(value);
            }
         });
         if (this._instance && this._property ){
            var firstLoad = true;
            var content = this._instance[this._property];
            if ( content ){
               self.onValue(content);
            }
            self._instance.$subscribe(self._property, function(oldvalue, newvalue){
               self.onValue(newvalue);
            });
         }

      }
   });
});
