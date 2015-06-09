'use strict'

var test = require('tape')
var types = require('../')
var string = types.getTypeParser(1009, 'text')
var date = types.getTypeParser(1115, 'text')
var boolean = types.getTypeParser(1000, 'text')

test('array parser', function (t) {
  t.deepEqual(string('{}'), [], 'empty')
  t.deepEqual(string('{""}'), [''], 'empty string')
  t.deepEqual(string('{1,2,3}'), ['1', '2', '3'], 'numerics')
  t.deepEqual(string('{a,b,c}'), ['a', 'b', 'c'], 'strings')
  t.deepEqual(string('{"\\"\\"\\"","\\\\\\\\\\\\"}'), ['"""','\\\\\\'], 'escaped')
  t.deepEqual(string('{NULL,NULL}'), [null, null], 'null')
  t.deepEqual(boolean('{t,NULL,f}'), [true, null, false], 'boolean')
  t.deepEqual(
    date('{2010-12-11 09:09:04.1}'),
    [new Date(2010,11,11,9,9,4,100)],
    'timestamp no tz'
  )
  t.deepEqual(
    date('{2010-12-11 09:09:04-08:00}'),
    [new Date('2010-12-11T17:09:04.000Z')],
    'timstamp with tz'
  )
  t.end()
})
