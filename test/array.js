var parse = require('../').getTypeParser(1009, 'text');
var assert = require('./assert');

describe('array parsing', function() {
  it("testing empty array", function(){
    var input = '{}';
    var expected = [];
    assert.deepEqual(parse(input), expected);
  });

  it("testing empty string array", function(){
    var input = '{""}';
    var expected = [""];
    assert.deepEqual(parse(input), expected);
  });

  it("testing numeric array", function(){
    var input = '{1,2,3,4}';
    var expected = [1,2,3,4];
    assert.deepEqual(parse(input), expected);
  });

  it("testing stringy array", function(){
    var input = '{a,b,c,d}';
    var expected = ['a','b','c','d'];
    assert.deepEqual(parse(input), expected);
  });

  it("testing stringy array containing escaped strings", function(){
    var input = '{"\\"\\"\\"","\\\\\\\\\\\\"}';
    var expected = ['"""','\\\\\\'];
    assert.deepEqual(parse(input), expected);
  });

  it("testing NULL array", function(){
    var input = '{NULL,NULL}';
    var expected = [null,null];
    assert.deepEqual(parse(input), expected);
  });
});
