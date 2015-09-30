var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var im = require('imagemagick');

domain.service("$imagemagic", function($copyFile) {
   return {
      convert: function(path, target, _opts) {
         return this.dimension(path).then(function(dm) {
            var width = _opts.width;
            var quality = _opts.quality;
            if (width && dm.width < width) {
               width = undefined;
            }

            if (!quality && !width) {
               return $copyFile(path, target).then(function() {
                  return {
                     target: target
                  };
               });
            }
            return new Promise(function(resolve, reject) {
               var opts = [path];
               if (width) {
                  opts.push('-resize');
                  opts.push(width + 'x' + width);
               }
               if (quality) {
                  opts.push('-quality');
                  opts.push(quality);
               }
               opts.push(target);
               im.convert(opts,
                  function(err, stdout) {
                     if (err) {
                        return reject(err);
                     }
                     return resolve({
                        target: target
                     });
                  });
            });
         });
      },
      resize: function(path, target, width, quality) {

         return this.dimension(path).then(function(dm) {
            if (dm.width > width) {
               return new Promise(function(resolve, reject) {
                  var opts = [path, '-resize', width + 'x' + width];
                  if (quality) {
                     opts.push('-quality');
                     opts.push(quality);
                  }
                  opts.push(target);
                  im.convert(opts,
                     function(err, stdout) {
                        if (err) {
                           return reject(err);
                        }
                        return resolve({
                           target: target
                        });
                     });
               });
            } else {
               return $copyFile(path, target).then(function() {
                  return {
                     target: target
                  };
               });
            }
         });
      },
      dimension: function(path) {
         return new Promise(function(resolve, reject) {
            im.identify(['-format', '%wx%h', path], function(err, output) {
               if (err) {
                  return reject(err);
               }
               var data = output.split("x");
               return resolve({
                  width: data[0] * 1,
                  height: data[1] * 1
               });
            });
         });
      }
   };
});
