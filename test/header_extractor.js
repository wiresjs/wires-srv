var assert = require('assert');
var should = require('should');
var domain = require("wires-domain");
require('require-all')(__dirname + '/../backend');

describe('Header is and question extractor', function() {
   var ripper;
   before(function(done) {
      domain.require(function($watsonRipper) {
         ripper = $watsonRipper;
         done();
      });
   });

   it("Should extract case 1", function() {
      var response = ripper.extractIdAndAnswer(
         "719C7647CCEF384C4EF5EBE76ABF0732 - 490 Q : 490) What is motion sickness?");
      response.id.should.equal("719C7647CCEF384C4EF5EBE76ABF0732");
      response.question.should.equal("What is motion sickness?");
   });

   it("Should extract case 2", function() {
      var response = ripper.extractIdAndAnswer(
         "93D5DBC099337E1A7A60E01989D3C114 - 117 Q : My dog is being sick, what should I do?");
      response.id.should.equal("93D5DBC099337E1A7A60E01989D3C114");
      response.question.should.equal("My dog is being sick, what should I do?");
   });
});
