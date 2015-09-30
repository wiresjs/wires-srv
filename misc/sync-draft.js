var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
var request = require("request");
var logger = require("log4js").getLogger("sync");
require('require-all')(__dirname + '/../backend');

/*
{ id: 644,
 url: ' /work/659.html',
 casUrl: ' /watsondata/xmgr/20150606-0809/rtpvpl0471.wdc/workspace/14c288bade8/corpus/output/cas/_659.html.xmi',
 user: 'eco212_administrator',
 timestamp: 1442214590354,
 size: 2144,
 state: 'INGESTED',
 message: '',
 fileName: '659.html',
 fileType: 'html',
 tags: [ '626-664' ],
 documentMetadata: [],
 configuration: '_text_html' }
 */

domain.service("$processDocument", function(Draft, $downloadWatsonHTML) {
   return function(item) {
      logger.info("Preprocessing %s", item.id);
      return new Promise(function(resolve, reject) {

         return Draft.find({
            watsonShortId: item.id
         }).first().then(function(record) {
            if (record) {
               logger.info("Record %s was found. Skipping", item.id);
               return resolve(record);
            }

            return $downloadWatsonHTML(item.id);
         }).then(function(html) {
            logger.info("Creating new draft for %s", item.id);
            var draft = new Draft();
            draft.set("watsonShortId", item.id);

            draft.setHTML(html);
            draft.set("fileName", item.fileName);
            draft.set("synced", true);
            draft.set("watsonData", item);
            return draft.save();
         }).then(function(draft) {
            logger.info("Created %s (%s) - %s", item.id, draft.get("_id"), draft.get(
               "question"));
            return resolve();
         }).catch(reject);
      });

   };
});

// domain.require(function(Draft){
//    return Draft.find().all().then(function(items){
//       return domain.each(items, function(draft){
//          //draft.set("synced", true);
//          return draft.save();
//       });
//    });
// });

domain.require(function($watsonDocuments, $processDocument, Draft) {
   return Draft.drop().then(function() {
      return $watsonDocuments().then(function(list) {
         return domain.each(list, function(item) {
            return $processDocument(item);
         });
      });
   });
}).then(function() {
   console.log("ALL DONE");
});
