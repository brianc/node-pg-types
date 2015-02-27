
//http://www.postgresql.org/docs/9.2/static/datatype.html

var tests = [{
  name: 'string/varchar',
  format: 'text',
  dataTypeID: 1043,
  actual: 'bang',
  expected: 'bang'
},{
  name: 'integer/int4',
  format: 'text',
  dataTypeID: 23,
  actual: '2147483647',
  expected: 2147483647
},{
  name: 'smallint/int2',
  format: 'text',
  dataTypeID: 21,
  actual: '32767',
  expected: 32767
},{
  name: 'bigint/int8',
  format: 'text',
  dataTypeID: 20,
  actual: '9223372036854775807',
  expected: '9223372036854775807'
},{
  name: 'oid',
  format: 'text',
  dataTypeID: 26,
  actual: '103',
  expected: 103
},{
  name: 'numeric',
  format: 'text',
  dataTypeID: 1700,
  actual: '31415926535897932384626433832795028841971693993751058.16180339887498948482045868343656381177203091798057628',
  expected: '31415926535897932384626433832795028841971693993751058.16180339887498948482045868343656381177203091798057628'
},{
  name: 'real/float4',
  dataTypeID: 700,
  format: 'text',
  actual: '123.456',
  expected: 123.456
},{
  name: 'double precision / float8',
  format: 'text',
  dataTypeID: 701,
  actual: '12345678.12345678',
  expected: 12345678.12345678
},{
  name: 'boolean true',
  format: 'text',
  dataTypeID: 16,
  actual: 't',
  expected: true
},{
  name: 'boolean false',
  format: 'text',
  dataTypeID: 16,
  actual: 'f',
  expected: false
},{
  name: 'boolean null',
  format: 'text',
  dataTypeID: 16,
  actual: null,
  expected: null
},{
  name: 'timestamptz with minutes in timezone',
  format: 'text',
  dataTypeID: 1184,
  actual: '2010-10-31 14:54:13.74-05:30',
  expected: function(val) {
    assert.UTCDate(val, 2010, 9, 31, 20, 24, 13, 740);
  }
}, {
  name: 'timestamptz with other milisecond digits dropped',
  format: 'text',
  dataTypeID: 1184,
  actual: '2011-01-23 22:05:00.68-06',
  expected: function(val) {
    assert.UTCDate(val, 2011, 0, 24, 4, 5, 0, 680);
  }
}, {
  name: 'timestampz with huge miliseconds in UTC',
  format: 'text',
  dataTypeID: 1184,
  actual: '2010-10-30 14:11:12.730838Z',
  expected: function(val) {
    assert.UTCDate(val, 2010, 9, 30, 14, 11, 12, 730);
  }
},{
  name: 'timestampz with no miliseconds',
  format: 'text',
  dataTypeID: 1184,
  actual: '2010-10-30 13:10:01+05',
  expected: function(val) {
    assert.UTCDate(val, 2010, 9, 30, 8, 10, 01, 0);
  }
},{
  name: 'timestamp',
  format: 'text',
  dataTypeID: 1114,
  actual:  '2010-10-31 00:00:00',
  expected: function(val) {
    assert.equal(val.toUTCString(), new Date(2010, 9, 31, 0, 0, 0, 0, 0).toUTCString());
    assert.equal(val.toString(), new Date(2010, 9, 31, 0, 0, 0, 0, 0, 0).toString());
  }
},{
  name: 'date',
  format: 'text',
  dataTypeID: 1082,
  actual: '2010-10-31',
  expected: function(val) {
    var now = new Date(2010, 9, 31);
    assert.UTCDate(val, 2010, now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), 0, 0, 0);
    assert.equal(val.getHours(), now.getHours());
  }
},{
  name: 'interval time',
  format: 'text',
  dataTypeID: 1186,
  actual: '01:02:03',
  expected: function(val) {
    assert.equal(val.toPostgres(), '3 seconds 2 minutes 1 hours');
    assert.deepEqual(val, {'hours':1, 'minutes':2, 'seconds':3});
  }
},{
  name: 'interval time with milliseconds',
  format: 'text',
  dataTypeID: 1186,
  actual: '01:02:03:456',
  expected: function(val) {
    assert.deepEqual(val, {'hours':1, 'minutes':2, 'seconds':3, 'milliseconds': 456});
  }
},{
  name: 'interval long',
  format: 'text',
  dataTypeID: 1186,
  actual: '1 year -32 days',
  expected: function(val) {
    assert.equal(val.toPostgres(), '-32 days 1 years');
    assert.deepEqual(val, {'years':1, 'days':-32});
  }
},{
  name: 'interval combined negative',
  format: 'text',
  dataTypeID: 1186,
  actual: '1 day -00:00:03',
  expected: function(val) {
    assert.equal(val.toPostgres(), '-3 seconds 1 days');
    assert.deepEqual(val, {'days':1, 'seconds':-3});
  }
},{
  name: 'bytea',
  format: 'text',
  dataTypeID: 17,
  actual: 'foo\\000\\200\\\\\\377',
  expected: function(val) {
    assert.deepEqual(val, new Buffer([102, 111, 111, 0, 128, 92, 255]));
  }
},{
  name: 'empty bytea',
  format: 'text',
  dataTypeID: 17,
  actual: '',
  expected: function(val) {
    assert.deepEqual(val, new Buffer(0));
  }
},

{
  name : 'array/char',
  format : 'text',
  dataTypeID: 1014,
  actual: '{asdf,asdf}',
  expected : function(val){
    assert.deepEqual(val, ['asdf','asdf']);
  }
},{
  name : 'array/varchar',
  format : 'text',
  dataTypeID: 1015,
  actual: '{asdf,asdf}',
  expected :function(val){
    assert.deepEqual(val, ['asdf','asdf']);
  }
},{
  name : 'array/text',
  format : 'text',
  dataTypeID: 1008,
  actual: '{"hello world"}',
  expected :function(val){
    assert.deepEqual(val, ['hello world']);
  }
},{
  name : 'array/bytea',
  format : 'text',
  dataTypeID: 1001,
  actual: '{"\\\\x00000000"}',
  expected :function(val){
    assert.deepEqual(val, [new Buffer('00000000', 'hex')]);
  }
},{
  name : 'array/numeric',
  format : 'text',
  dataTypeID: 1231,
  actual: '{1.2,3.4}',
  expected :function(val){
    assert.deepEqual(val, [1.2,3.4]);
  }
},{
  name : 'array/int2',
  format : 'text',
  dataTypeID: 1005,
  actual: '{-32768, -32767, 32766, 32767}',
  expected :function(val){
    assert.deepEqual(val, [-32768, -32767, 32766, 32767]);
  }
},{
  name : 'array/int4',
  format : 'text',
  dataTypeID: 1007,
  actual: '{-2147483648, -2147483647, 2147483646, 2147483647}',
  expected :function(val){
    assert.deepEqual(val, [-2147483648, -2147483647, 2147483646, 2147483647]);
  }
},{
  name : 'array/int8',
  format : 'text',
  dataTypeID: 1016,
  actual: '{-9223372036854775808, -9223372036854775807, 9223372036854775806, 9223372036854775807}',
  expected :function(val){
    assert.deepEqual(val, [
                     '-9223372036854775808',
                     '-9223372036854775807',
                     '9223372036854775806',
                     '9223372036854775807']);
  }
},{
  name : 'array/float4',
  format : 'text',
  dataTypeID: 1021,
  actual: '{1.2, 3.4}',
  expected :function(val){
    assert.deepEqual(val, [1.2, 3.4]);
  }
},{
  name : 'array/float8',
  format : 'text',
  dataTypeID: 1022,
  actual: '{-12345678.1234567, 12345678.12345678}',
  expected :function(val){
    assert.deepEqual(val, [-12345678.1234567, 12345678.12345678]);
  }
},{
  name : 'array/date',
  format : 'text',
  dataTypeID: 1182,
  actual: '{2014-01-01,2015-12-31}',
  expected :function(val){
    var now = new Date(2014, 0, 1);
    var then = new Date(2015, 11, 31);
    assert.equal(val.length, 2);
    val.forEach(function(element, index) {
      var match = index ? then : now;
      assert.UTCDate(element, match.getUTCFullYear(), match.getUTCMonth(), match.getUTCDate(), match.getUTCHours(), 0, 0, 0);
    });
  }
},{
  name: 'binary-string/varchar',
  format: 'binary',
  dataTypeID: 1043,
  actual: 'bang',
  expected: 'bang'
},{
  name: 'binary-integer/int4',
  format: 'binary',
  dataTypeID: 23,
  actual: [0, 0, 0, 100],
  expected: 100
},{
  name: 'binary-smallint/int2',
  format: 'binary',
  dataTypeID: 21,
  actual: [0, 101],
  expected: 101
},{
  //    name: 'binary-bigint/int8',
  //    format: 'binary',
  //    dataTypeID: 20,
  //    actual: [0, 0, 0, 0, 0, 0, 0, 102],
  //    expected: '102'
  //  },{
  //    name: 'binary-bigint/int8-full',
  //    format: 'binary',
  //    dataTypeID: 20,
  //    actual: [1, 0, 0, 0, 0, 0, 0, 102],
  //    expected: '72057594037928038'
  //  },{
  name: 'binary-oid',
  format: 'binary',
  dataTypeID: 26,
  actual: [0, 0, 0, 103],
  expected: 103
},{
  name: 'binary-numeric',
  format: 'binary',
  dataTypeID: 1700,
  actual: [0,2,0,0,0,0,0,0x64,0,12,0xd,0x48,0,0,0,0],
  expected: 12.34
},{
  name: 'binary-real/float4',
  dataTypeID: 700,
  format: 'binary',
  actual: [0x41, 0x48, 0x00, 0x00],
  expected: 12.5
},{
  name: 'binary-double precision / float8',
  format: 'binary',
  dataTypeID: 701,
  actual: [0x3F,0xF3,0x33,0x33,0x33,0x33,0x33,0x33],
  expected: 1.2
},{
  name: 'binary-boolean true',
  format: 'binary',
  dataTypeID: 16,
  actual: [1],
  expected: true
},{
  name: 'binary-boolean false',
  format: 'binary',
  dataTypeID: 16,
  actual: [0],
  expected: false
},{
  name: 'binary-boolean null',
  format: 'binary',
  dataTypeID: 16,
  actual: null,
  expected: null
},{
  name: 'binary-timestamp',
  format: 'binary',
  dataTypeID: 1184,
  actual: [0x00, 0x01, 0x36, 0xee, 0x3e, 0x66, 0x9f, 0xe0],
  expected: function(val) {
    assert.UTCDate(val, 2010, 9, 31, 20, 24, 13, 740);
  }
},{
  name: 'binary-string',
  format: 'binary',
  dataTypeID: 25,
  actual: new Buffer([0x73, 0x6c, 0x61, 0x64, 0x64, 0x61]),
  expected: 'sladda'
},{
  name: 'point',
  format: 'text',
  dataTypeID: 600,
  actual: '(25.1,50.5)',
  expected: function(val) {
    assert.deepEqual(val, { x: 25.1, y: 50.5 });
  }
},{
  name: 'circle',
  format: 'text',
  dataTypeID: 718,
  actual: '<(25,10),5>',
  expected: function(val) {
    assert.deepEqual(val, { x: 25, y: 10, radius: 5 });
  }
}];

var pgTypes = require('../');
var assert = require('./assert');

describe('type parsing', function() {
  tests.forEach(function(test) {
    test.format = test.format || 'text';
    it('correctly parses ' + test.name + ' (' + test.format + ')', function() {
      var parser = pgTypes.getTypeParser(test.dataTypeID, test.format);
      var result = parser(test.actual);
      if(typeof test.expected == 'function') {
        return test.expected(result);
      }
      assert.strictEqual(result, test.expected);
    });
  });
});

describe('interface', function() {
  it('exports text parsers by default', function() {
    assert.strictEqual(pgTypes.getTypeParser(23), pgTypes.getTypeParser(23, 'text'));
  });
});
