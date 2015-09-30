domain.service("controllers.MainController", ['$landingMenu'],
   function($landingMenu) {
      return ['base.html', function() {
         this.menu = $landingMenu;
         this.signOut = function() {
            alert(1);
         };
      }];
   });
