var assert = require('assert');
var should = require('should');
var domain = require("wires-domain");
require('require-all')(__dirname + '/../backend');

describe('Api Humanizer should humanize', function() {
   var ripper;
   before(function(done) {
      domain.require(function($watsonRipper) {
         ripper = $watsonRipper;
         done();
      });
   });
   it("Should extract 'Typical symptoms include' from a description", function() {
      var text = ripper.beautifyDescription("Although the exact cause is unknown, the symptoms include:");
      text.should.be.equal("Although the exact cause is unknown");
   });

   it("Should should not find any matchers", function() {
      var text = ripper.beautifyDescription("Although the exact cause is unknown");
      text.should.be.equal("Although the exact cause is unknown");
   });

   it("Should beautify finding a period", function() {
      var text = ripper.beautifyDescription("to the joint. Typical symptoms include: ");
      text.should.be.equal("to the joint");
   });

   it("Should beautify finding a coma", function() {
      var text = ripper.beautifyDescription("to the joint, Typical symptoms include: ");
      text.should.be.equal("to the joint");
   });

   it("Should beautify finding a colon", function() {
      var text = ripper.beautifyDescription("to the joint: Typical symptoms include: ");
      text.should.be.equal("to the joint");
   });

   it("Should not cut anything", function() {
      var text = ripper.beautifyDescription("symptoms include: ");
      text.should.be.equal("symptoms include: ");
   });
   it("Should not beautify using 'with symptoms typically including'", function() {
      var text = ripper.beautifyDescription(
         "In MOD, these growth plates become highly inflamed, with symptoms typically including:"
      );
      text.should.be.equal("In MOD, these growth plates become highly inflamed");
   });

   it("In case of slice is too little - we slice by the closest index occurance", function() {
      var text = ripper.beautifyDescription(
         "In MOD, these growth plates become highly symptoms include: inflamed, with symptoms typically including:"
      );
      text.should.be.equal("In MOD, these growth plates become highly symptoms include: inflamed");
   });
   it("Should stip very long text", function() {
      var text =
         "Black Hair Follicular Dysplasia is a rare colour-linked defect in the development of the follicles of black hairs. It is believed to be genetic, and certain breeds (e.g. Munsterlanders, Huntaways, some lines of Jack Russell Terrier, Gordon Setters and Salukis) are more likely to be affected.\nAffected puppies appear normal at birth but generally begin start to lose their hair at about 4 weeks of age. Only black hairs are affected and the condition progresses until all the black hairs have been lost.\nA vet can diagnose black hair follicular alopecia by first ruling out other hair loss and skin diseases, then performing a microscopic examination of plucked hairs, and biopsy. Unfortunately there is no known treatment but prognosis is good. Though black hair follicular alopecia is irreversible, it is a cosmetic problem that doesn't influence the dog's quality of life.";
      var data = ripper.beautifyDescription(text);
      data.should.be.equal(
         "Black Hair Follicular Dysplasia is a rare colour-linked defect in the development of the follicles of black hairs. It is believed to be genetic, and certain breeds (e.g. Munsterlanders, Huntaways, some lines of Jack Russell Terrier"
      );
   });

   //"preview": "Black Hair Follicular Dysplasia is a rare colour-linked defect in the development of the follicles of black hairs. It is believed to be genetic, and certain breeds (e.g. Munsterlanders, Huntaways, some lines of Jack Russell Terrier, Gordon Setters and Salukis) are more likely to be affected.\nAffected puppies appear normal at birth but generally begin start to lose their hair at about 4 weeks of age. Only black hairs are affected and the condition progresses until all the black hairs have been lost.\nA vet can diagnose black hair follicular alopecia by first ruling out other hair loss and skin diseases, then performing a microscopic examination of plucked hairs, and biopsy. Unfortunately there is no known treatment but prognosis is good. Though black hair follicular alopecia is irreversible, it is a cosmetic problem that doesn't influence the dog's quality of life.",

});
