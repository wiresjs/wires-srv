var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var shortid = require("shortid");
var path = require("path");
var appRoot = require("app-root-path");
var fs = require("fs");
var mkdirp = require('mkdirp');

var uploadDir = "/user-images/";
//$userToken
domain.path("/upload",
   // Only super admins are allowed to go there
   {
      post: function($body, $req, $userToken, $imagemagic, Image) {
         $body.require("project");
         $body.require("folder");

         var projectFolder = $body.attrs.project;
         var targetFolder = $body.attrs.folder;
         return domain.each($req.files, function(f) {
            return new Promise(function(resolve, reject) {

               var extension = path.extname(f.path);
               // Moving files to it's destination
               var filename = shortid.generate();

               var targetPath = path.join(appRoot.path, uploadDir, projectFolder, targetFolder);
               var newFilePath = path.join(targetPath, filename);
               var publicPath = path.join(projectFolder, targetFolder, filename);
               // Creating destination folder
               mkdirp.sync(targetPath);
               var source = fs.createReadStream(f.path);
               var dest = fs.createWriteStream(newFilePath);

               // Moving source to destination
               source.pipe(dest);
               source.on('end', function() {
                  // Removing after all
                  fs.unlinkSync(f.path);
                  $imagemagic.resize(newFilePath, newFilePath, 1280).then(function() {
                     return resolve({
                        name: filename,
                        project: projectFolder,
                        folder: targetFolder,
                        publicPath: publicPath,
                        meta: f
                     });
                  }).catch(reject);
               });
               source.on('error', function(err) {
                  // Removing after all
                  fs.unlinkSync(f.path);
                  return reject(err);
               });
            });
         }).then(function(files) {
            return domain.each(files, function(item) {
               delete item.meta.path;
               delete item.meta.buffer;
               delete item.meta.name;
               item.token = $userToken;
               var image = new Image(item);
               return image.save();
            });
         });
      }
   }
);
