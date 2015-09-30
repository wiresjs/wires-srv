domain.service("$access", function($user) {
   var permission = $user.group.permissions;
   return function(key) {
      if (permission.root === true) {
         return true;
      }
      return permission[key] === true;
   };
});
