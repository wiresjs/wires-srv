// var _ = require('lodash');
// var domain = require('wires-domain');
// var Promise = require('promise');
// var path = require("path");
// var walk = require("walk");
// var fs = require("fs");
//
// require('require-all')(__dirname + '/backend');
//
// domain.service("$getNewQuestions", function() {
//    return function() {
//       return new Promise(function(resolve, reject) {
//          walker = walk.walk("new_questions");
//          var files = [];
//          walker.on("file", function(root, fileStats, next) {
//
//             var content = fs.readFileSync(path.join(root, fileStats.name));
//             files.push({
//                name: fileStats.name,
//                content: content.toString()
//             });
//             next();
//          });
//
//          walker.on("end", function() {
//             return resolve(files);
//          });
//       });
//    };
//
// });
// domain.require(function($getNewQuestions, $syncDraft, Draft) {
//    return $getNewQuestions().then(function(files) {
//
//       return domain.each(files, function(file) {
//          var draft = new Draft();
//          draft.set("fileName", file.name);
//          draft.setHTML(file.content);
//          return draft.save().then(function(draft) {
//             return $syncDraft(draft);
//          });
//       });
//    });
// }).then(function() {
//    console.log("ALL DONE");
// });
