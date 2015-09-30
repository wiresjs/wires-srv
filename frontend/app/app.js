$(function() {
   domain.require(function($router) {
      $router.add('/admin/:b?/:c?/:d?/:e?', 'MainController', [

         $router.state('/admin/tokens', 'TokenController'),
         $router.state('/admin/ask', 'AskController'),
         $router.state('/admin/logs', 'AccessLogsController'),
         $router.state('/admin/draft', 'DraftController')
      ]);

      $router.start();
   });

});
