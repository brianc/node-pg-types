'use strict'

var test = require('tape')
var parse = require('../').getTypeParser(1114, 'text')

test('date parser', function (t) {
  t.equal(
    parse('2010-12-11 09:09:04').toString(),
    new Date('2010-12-11 09:09:04').toString()
  )

  function ms (string) {
    var base = '2010-01-01 01:01:01'
    return parse(base + string).getMilliseconds()
  }
  t.equal(ms('.1'), 100)
  t.equal(ms('.01'), 10),
  t.equal(ms('.74'), 740)

  function iso (string) {
    return parse(string).toISOString()
  } 
  t.equal(
    iso('2010-12-11 09:09:04.1'),
    new Date(2010,11,11,9,9,4,100).toISOString(),
    'no timezones'
  )

  t.equal(
    iso('2011-01-23 22:15:51.280843-06'),
    '2011-01-24T04:15:51.280Z',
    'huge ms value'
  )

  t.equal(
    iso('2011-01-23 22:15:51Z'),
    '2011-01-23T22:15:51.000Z',
    'zulu time offset'
  )

  t.equal(
    iso('2011-01-23 22:15:51Z'),
    '2011-01-23T22:15:51.000Z',
    'zulu time offset'
  )

  t.equal(
    iso('2011-01-23 10:15:51-04'),
    '2011-01-23T14:15:51.000Z',
    'negative hour offset'
  )

  t.equal(
    iso('2011-01-23 10:15:51+06:10'),
    '2011-01-23T04:05:51.000Z',
    'positive HH:mm offset'
  )

  t.equal(
    iso('2011-01-23 10:15:51-06:10'),
    '2011-01-23T16:25:51.000Z',
    'negative HH:mm offset'
  )

  t.equal(
    iso('0005-02-03 10:53:28+01:53:28'),
    '0005-02-03T09:00:00.000Z',
    'positive HH:mm:ss offset'
  )

  t.equal(
    iso('0005-02-03 09:58:45-02:01:15'),
    '0005-02-03T12:00:00.000Z',
    'negative HH:mm:ss offset'
  )

  t.end()
})
