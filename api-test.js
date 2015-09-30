var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise');
require('require-all')(__dirname + '/backend');
var cheerio = require('cheerio');
//93D5DBC099337E1A7A60E01989D3C114
domain.require(function($watsonApi) {

   $watsonApi.ask({
      q: "Why is my dog calling my name??"
   }).then(function(data) {
      //console.log(JSON.stringify(data, 2, 2));
   }).catch(function(e) {
      console.log(e);
   });
   // var text =
   //    '<h1 class="topicTitle">270) How do I know if my dog has hip dysplasia?</h1> <p>Hip Dysplasia is a <b>developmental disorder</b> in dogs that results in the hip joint not fitting together properly. It is a common problem in many breeds, especially Labradors, Golden Retrievers, St Bernards, German Shepherds and Rottweilers; and is <b>largely genetic in origin</b>. It results in the ball and socket joints of the hips not fitting correctly; although the condition is present from a very early age, <b>symptoms may not become apparent until later in life</b>, by which stage secondary arthritis has done severe damage to the joint.\n<br/><br/>Typical symptoms include:\n</p><ul><li><b>Decreased activity.</b></li>\n<li><b>Difficulty</b> or <b>pain on rising.</b></li>\n<li>Reluctance to <b>run</b>, <b>jump</b>, or <b>climb stairs</b>.</li>\n<li>Intermittent or persistent <b>hind leg lameness</b>; usually both legs are affected although one may be worse than the other.</li>\n<li>The dog may develop an <b>abnormal gait</b> because the hips don\'t work properly; typically described as: <ul><li>&quot;Bunny hopping&quot;.</li>\n<li>&quot;Swaying&quot;.</li>\n<li>&quot;Marilyn Monroe&quot; - narrow based stance.</li>\n</ul></li><li>There will also often be <b>pain</b> on palpation of the hip joints, or extension of the hips.</li>\n<li>There may be <b>crepitus</b> (abnormal grating sounds) or <b>reduced motion</b> in the hips.</li>\n<li>Sometimes, the thigh muscles will <b>atrophy</b> due to disuse.</li>\n</ul>Diagnosis is based on clinical signs and confirmed by X-rays. On the X-ray, dysplastic hip joints will appear to have square femoral heads (the ball of the hip joint), a shallow acetabulum (the socket), and the hip ball will sit shallow in the hip socket, and may not fit at all. <ul><li><b>If your dog is lame and/or you suspect hip dysplasia, you should seek veterinary advice - the earlier the condition is diagnosed, the more can be done.</b></li>\n</ul>';
   // var $ = cheerio.load(text);
   // $("h1:first-child").remove();
   // var desc = $("p:first-child").html();
   // console.log(desc);
   // console.log("*********");
   // console.log($.html());
});
