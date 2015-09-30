var domain = require('wires-domain');

// App Routins ************************************
var express = require('express');
var wires = require("wires.js");
var path = require("path");
var appDir = require("app-root-path");
var swig = require("swig");
var fs = require("fs");
var includeAll = require("wires-include-all");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var domain = require("wires-domain");
var logger = require("log4js").getLogger("watson");
var multer = require('multer');
var dir = __dirname + '/.uploads';
var userDir = __dirname + '/user-images';
if (!fs.existsSync(dir)) {
   fs.mkdirSync(dir, 0744);
}
if (!fs.existsSync(userDir)) {
   fs.mkdirSync(userDir, 0744);
}
var busboy = require('connect-busboy');
// app.use(busboy({
//    immediate: true
// }));
app.use(multer({
   dest: dir
}));

app.use(cookieParser('your secret here'));

// frontend configuration
app.all("/views.js", wires.views(__dirname + '/frontend/app/views').express());
app.use('/static', express.static(__dirname + '/frontend/static'));
app.use('/app', express.static(__dirname + '/frontend/app/'));
app.use('/bower', express.static(__dirname + '/frontend/bower_components/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

domain.path("/", function($res) {
   $res.redirect(301, '/admin');
});

// Removing session
domain.path("/test",
   function($res) {
      var tplPath = path.join(appDir.path, "frontend/upload.html");
      var contents = swig.render(fs.readFileSync(tplPath).toString(), {
         locals: {}
      });
      $res.send(contents);
   }
);

domain.path("/admin/login", {
   post: function($body, $session, $res, User) {
      $body.require('email', 'password');
      var user = new User();
      // Everything return promises here
      return user.login($body.attrs.email, $body.attrs.password)
         .then(function(user) {
            return $session.generate(user);
         });
   }
});

// Removing session
domain.path("/admin/logout",
   function($res, $session) {
      return $session.remove().then(function() {
         $res.redirect('/admin');
      });
   }
);

// Main auth
domain.path(new RegExp('\/admin.*'),
   function($req, $res, $session, $next) {
      var tplPath = path.join(appDir.path, "frontend/index.html");
      if (!$session.isValid()) {
         tplPath = path.join(appDir.path, "frontend/login.html");
      }

      return includeAll(path.join(appDir.path, "frontend/app"), {
         order: ['services', 'resources', 'controllers'],
         ignore: ['app.js'],
         rootPath: "/app/",
         tagOutput: true
      }).then(function(list) {
         var userJson = "{}";
         if ($session.session) {
            userJson = JSON.stringify($session.session);
         }
         var contents = swig.render(fs.readFileSync(tplPath).toString(), {
            locals: {
               js: list,
               userJson: userJson
            }
         });
         $res.send(contents);
      });
   }
);

require('require-all')(__dirname + '/backend');

domain.require(function($wiresMongoIndexer) {
   //return $wiresMongoIndexer("Draft");
});
app.use(domain.express());
// **********************************************

var appPort = process.env.PORT || 3001;
var server = app.listen(appPort, function() {
   var host = server.address().address;
   var port = server.address().port;
   logger.info('Watson app listening on http://localhost:%s', appPort);
});
