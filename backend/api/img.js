var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var path = require("path");
var appRoot = require("app-root-path");
var fs = require("fs");
var mkdirp = require('mkdirp');

var uploadDir = "/user-images/";
//$userToken
domain.path("/img/:project/:folder/:image", {
   get: function($body, $params, $query, $imagemagic, $req, $res, Image) {

      return Image.find({
         project: $params.project,
         folder: $params.folder,
         name: $params.image
      }).first().then(function(img) {
         // Stream not found image
         var notfound = function() {
            var fstream = fs.createReadStream(path.join(appRoot.path, 'not_found.png'));
            fstream.pipe($res);
         };
         var streamPath = function(path) {
            if (fs.existsSync(path)) {
               var fstream = fs.createReadStream(path);
               fstream.pipe($res);
            } else {
               notfound();
            }
         };
         if (img) {
            var originalPath = path.join(appRoot.path, uploadDir, img.get("publicPath"));
            var requestedPath = originalPath;
            // Checking if width is requested
            var width = $query.attrs.width * 1;
            var quality = $query.attrs.quality * 1;
            var modifications = {};
            if (width > 0) {
               modifications.width = width;
            }
            if (quality > 0) {
               modifications.quality = quality;
            }
            if (_.size(modifications)) {
               var p = [];
               _.each(modifications, function(value, modifier) {
                  p.push(modifier + "=" + value);
               });
               requestedPath += "?" + p.join("&");
               if (fs.existsSync(requestedPath)) {
                  console.log("from cache..", requestedPath);
                  return streamPath(requestedPath);
               }
               return $imagemagic.convert(originalPath, requestedPath, modifications).then(function() {
                  console.log("converted..", requestedPath);
                  return streamPath(requestedPath);
               });
            } else {
               return streamPath(originalPath);
            }
         } else {
            notfound();
         }
      });
   }
});
