(function() {
   var menu;
   domain.service("$landingMenu", ['$history', '$access'], function($history, $access) {
      // Icons are here
      // http://semantic-ui.com/elements/icon.html

      if (!menu) {
         menu = {
            nav: function(a) {
               $history.go(a.link);
               var all = _.union(this.userMenu, this.rootMenu);
               _.each(all, function(item) {
                  item.active = item.link === a.link;
               });
            },
            userMenu: []
         };
         if ($access("tokens")) {
            menu.userMenu.push({
               title: "Access tokens",
               link: "/admin/tokens",
               icon: "plug"
            });
         }
      }

      return menu;
   });
})();
