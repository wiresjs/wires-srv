(function() {
   var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
   var is_safari = navigator.userAgent.indexOf("Safari") > -1;
   var htmlToBBCode = function(html) {
      html = html.replace(/<br>/gi, "\n");
      html = html.replace(/<div>/gi, "");
      html = html.replace(/<\/div>/gi, "\n");
      html = html.replace(/<a href="([^"]+)">([^<]+)<\/a>/gmi, '[url=$1]$2[/url]');
      var tags = 'h1|b|ol|ul|li|strong|h3|blockquote|strike';
      var re = new RegExp("<(\/)?(" + tags + ")[^>]*>", "gmi");
      html = html.replace(re, "[$1$2]");
      html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "");
      html = html.replace(/(\r\n|\n|\r){3,}/gim, '\n\n');
      return html;
   };

   // Editor actions
   var EditorActions = function() {};
   EditorActions.prototype = {
      init: function() {
         this.methods = {};
         this.add('bold', {
            icon: 'fa fa-bold',
            title: "Bold",
            cmd: function() {
               this.execCommand("bold");
            }
         });

         this.add('strikethrough', {
            icon: 'fa fa-strikethrough',
            title: 'Strikethrough',
            cmd: function() {
               this.execCommand("strikethrough");
            }
         });

         this.add('unorderedlist', {
            icon: 'fa fa-list-ul',
            title: 'Unordered list',
            cmd: function() {
               this.execCommand("insertunorderedlist");
            }
         });

         this.add('link', {
            icon: 'fa fa-link',
            title: 'Link',
            cmd: function() {
               var link = prompt('Please specify the link.');
               if (link) {
                  document.execCommand('createLink', false, link);
               }
            }
         });

         this.add('unlink', {
            icon: 'fa fa-unlink',
            title: 'Unlink',
            cmd: function() {
               document.execCommand("unlink", false, []);
            }
         });


         this.add('orderedlist', {
            icon: 'fa fa-list-ol',
            title: 'Ordered list',
            cmd: function() {
               this.execCommand("insertorderedlist");
            }
         });
      },
      add: function(key, data) {
         this.methods[key] = data;
      }
   };
   var actions = new EditorActions();
   actions.init();

   var SaneEditorMethods = {
      init: function(textarea, options) {
         var self = this;



         this.outputCallbacks = [];
         this.actionEvents = {};
         this.onTextChangeCallbacks = [];

         this.textarea = textarea;


         this.options = options;
         // var height = options.height || textarea.height();
         // var width = options.height || textarea.width();

         this.editor = $('<div/>');
         this.editor.addClass('sane-editor');
         this.toolbar = $('<div/>').addClass('toolbar');
         this.toolbar.appendTo(this.editor);
         // Content div
         this.content = $('<div/>').addClass('content');
         this.content.attr("contenteditable", "true");
         this.content.appendTo(this.editor);
         this.editor.insertAfter(textarea);

         // Hacky paste event
         $(this.content).bind("paste", function(e) {
            var el = $(e.currentTarget);
            var text = e.originalEvent.clipboardData.getData('Text');
            e.originalEvent.preventDefault();

            text = text.trim().split("\n").join("<br>");
            self.execCommand("insertHTML", false, text);
            self.onTextChange();
         });

         this.bindUserTricks();
         // Getting rid of textarea
         //textarea.hide();
         //this.setValue(this.textarea.val(), true);
         this.initToolBar();
         this.bindActionEvents();
      },
      setValue: function(value) {
         value = value.trim().replace(/(?:\r\n|\r|\n)/g, '<br />');
         this.content.html(value);
         this.bindActionEvents();

         this.onTextChange(true);

      },
      // User TRICKS
      bindUserTricks: function() {
         var updateTimeout;

         var self = this;
         var divStack = [];
         $(this.content).bind("keyup", function(e) {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function() {
               var range = self.getRange();
               if (!range)
                  return;

               // Check for no-keyboard-interaction
               // IF class is there, we should jump from the wrapper
               var currentPosition = $(range.commonAncestorContainer);
               var parentWrapper = currentPosition.parents('.wrapper');
               if (parentWrapper.hasClass("capture-keyboard-interaction")) {
                  var newline = $('<div></br></div>');
                  newline.insertAfter(parentWrapper);
                  if (currentPosition) {
                     console.log(currentPosition[0]);

                  }
                  self.setCaretPosition(newline[0], 1);
                  return;
               }

               // ENTER TRICK
               if (e.keyCode === 13) {

                  // If we are in a wrapper
                  if (parentWrapper[0]) {
                     if (currentPosition[0].nodeType === 3) {
                        currentPosition = currentPosition.parent();
                     }
                     var currentIsEmpty = $(currentPosition).text() === '';
                     console.log("current", currentPosition[0]);


                     var nextEmptySiblings = 0;
                     // Checking how many previous items are empty
                     var prevItems = [];
                     currentPosition.prevAll().each(function() {
                        prevItems.push(this);
                     });
                     prevItems.reverse();

                     var toRemove = [];
                     _.each(prevItems, function(item) {

                        if ($(item).text() === '') {
                           nextEmptySiblings++;
                           toRemove.push(item);
                        } else {
                           toRemove = [];
                           nextEmptySiblings = 0;
                        }
                     });

                     // Current one has to be removed as well
                     // If it's empty
                     if (currentIsEmpty) {
                        toRemove.push(currentPosition);
                        nextEmptySiblings++;
                     }
                     // Jumping out of the box
                     if (nextEmptySiblings === 2) {

                        if (toRemove.length > 0) {
                           // Get the rest guys with us
                           var thelast = toRemove[toRemove.length - 1];

                           if (thelast) {
                              $(thelast).nextAll().insertAfter(parentWrapper);
                           }
                        }
                        _.each(toRemove, function(item) {
                           $(item).remove();
                        });

                        var newline = $('<div></br></div>');
                        newline.insertAfter(parentWrapper);
                        self.setCaretPosition(newline[0], 1);
                     }

                  } else {

                     divStack = [];
                  }

               }

               self.onTextChange();
            }, 200);
         });
      },
      getValue: function() {
         return this.updateTextArea();
      },
      bindEvents: function(name, args) {
         if (this.actionEvents[name]) {
            this.actionEvents[name].apply(this, args)
         }
      },
      bindActionEvents: function() {
         var self = this;
         _.each(this.actionEvents, function(cb, key) {
            cb.apply(self);
         });
      },
      onToolBarAction: function(cmd) {
         var self = this;
         if (_.isFunction(cmd)) {
            // Custom handler
            var range = self.getRange();
            if (range) {

               var selectedText = range.commonAncestorContainer;
               var parent = $(selectedText).parent();
               var withinEditor = $(selectedText).parents(".sane-editor .content");
               var text;

               if (withinEditor[0]) {
                  if (parent.hasClass("content")) {
                     text = selectedText;
                  }
                  cmd.apply(self, [text, parent, range]);

               } else {
                  cmd.apply(self, [null, null, range]);
               }

               self.onTextChange();
            }
         } else {

            if (_.isString(cmd)) {
               if (self.defaultActions[cmd]) {
                  self.defaultActions[cmd].apply(self, [self.defaultActions]);
                  self.onTextChange();
               }
            }
         }


      },
      onChange: function(cb) {
         this.onTextChangeCallbacks.push(cb);
      },

      onSave: function(cb) {
         this.onTextChangeCallbacks.push(cb);
      },
      onTextChange: function(initialized) {
         var data = this.updateTextArea();

         _.each(this.onTextChangeCallbacks, function(cb) {

            cb(data, initialized);
         });
      },
      initToolBar: function() {
         var self = this;
         var toolbarData = this.options.toolbar || [];
         var ul = $("<ul></ul>");
         this.toolbar.append(ul);

         $(document).ready(function() {
            var wrapper = ".inner-modal-content";
            var scrollbarOffset = $(self.toolbar).offset();

            // $(wrapper).scroll(function() {
            //    var scrolled = $(wrapper).scrollTop();
            //    var offset = $(self.editor).offset();
            //    var visible = self.toolbar.is(':visible');
            //    var editorHeight = self.editor.height();
            //    if (visible) {
            //       if (offset.top <= 0) {
            //          self.toolbar.css({
            //             top: 43,
            //             left: 15,
            //             position: "fixed",
            //             width: self.editor.width()
            //          }).addClass("toolbar-shadow");
            //       } else {
            //          self.toolbar.css({
            //             position: "relative",
            //             top: 0,
            //             left: "auto",
            //             width: "auto"
            //          }).removeClass("toolbar-shadow");
            //       }
            //
            //
            //
            //       if (Math.abs(offset.top) >= editorHeight) {
            //          self.toolbar.css("position", "relative");
            //       }
            //
            //    }
            //    //   console.log(scrollbarOffset)
            // });
         });
         _.each(toolbarData, function(toolbarName) {
            var li;
            if (actions.methods[toolbarName]) {

               var data = actions.methods[toolbarName];

               if (data.toOutput) {
                  self.outputCallbacks.push(data.toOutput);
               }
               if (data.bindEvents) {

                  self.actionEvents[toolbarName] = data.bindEvents;
               }
               if (data.init) {
                  data.init.apply(self);
               }
               li = $("<li><a href='#'></a></li>");
               li.find('a')
                  .addClass(data.icon).attr("title", data.title)
                  .click(function(e) {
                     if (_.isFunction(data.click)) {
                        data.click.apply(self);
                     }
                     self.onToolBarAction(data.cmd);
                     e.originalEvent.preventDefault();
                  });
               li.appendTo(ul);

            }
         });

      },
      // Getting values

      updateTextArea: function() {
         var saneOutput = this.makeSaneOutput(this.content.html());
      //   this.textarea.val(saneOutput);
         return saneOutput;
      },
      setCaretPosition: function(elem, caretPos) {
         if (elem !== null) {
            var range = this.getRange();
            var sel = this.getSelection();
            range.setStart(elem, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
         }
      },
      getSelection: function() {

         return document.getSelection();
      },
      getRange: function() {
         var s = this.getSelection();
         if (!s) {
            return null;
         }
         if (s.getRangeAt) {
            if (s.rangeCount > 0) {
               return s.getRangeAt(0);
            }
         }
         if (s.createRange) {
            return s.createRange();
         }
         return null;
      },
      execCommand: function(a, b, c) {
         this.content.focus();
         document.execCommand(a, b || false, c || null);
      },
      ec: function(a, b, c) {
         this.execCommand(a, b, c);
      },
      queryCommandValue: function(a) {
         this.editor.focus();
         return this.editor.queryCommandValue(a);
      },
      qc: function(a) {
         return this.queryCommandValue(a);
      },

      wrapUserContent: function(opts) {
         var selector = opts.selector || '';
         var tag = opts.tag || '';
         var className = opts.className;
         var self = this;
         $(this.content).find(selector).each(function() {

            var bound = $(this).data("bound");
            // Bind only once
            if (!bound) {
               var item = $(this);
               // Current html to be wrapped
               var text = item.text();
               var wrapper = [];
               wrapper.push('<div class="wrapper">');
               wrapper.push('<div class="user-controls">');

               if (opts.onRemove) {
                  wrapper.push('<span class="remove fa fa-times"></span>');
               }
               wrapper.push('</div>');

               wrapper.push('<div class="user-content">');

               var openingTag = tag;
               if (className) {
                  openingTag += ' class="' + className + '"';
               }
               wrapper.push('<' + openingTag + '><div>' + text + "</div></" + tag + ">");

               wrapper.push('</div>');
               wrapper.push('</div>');

               var cnt = $(wrapper.join(''));
               item.replaceWith(function() {
                  return cnt;
               });

               cnt.find(selector).data("bound", true);
               if (opts.onRemove) {
                  cnt.find('.remove').click(function() {
                     opts.onRemove(cnt);
                  });
               }

            }
         });
      },
      makeSaneOutput: function(html) {
         _.each(this.outputCallbacks, function(cb) {
            html = cb(html);
         });
         data = htmlToBBCode(html);
         return data;
      },
   };


   // Initialize and prototyping
   var SaneEditor = function() {
      this.init.apply(this, arguments);
   };

   SaneEditor.prototype = SaneEditorMethods;

   var NoBullshitEditor = function(element, options) {

   };

   NoBullshitEditor.actions = actions;

   window.SaneEditor = SaneEditor;
})();
