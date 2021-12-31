'use strict'
const PostgresInterval = require('postgres-interval')

const {
  Range,
  RANGE_EMPTY,
  RANGE_LB_INC,
  RANGE_LB_INF,
  RANGE_UB_INF,
  RANGE_UB_INC
} = require('postgres-range')

exports['string/varchar'] = {
  format: 'text',
  id: 1043,
  tests: [
    ['bang', 'bang']
  ]
}

exports['integer/int4'] = {
  format: 'text',
  id: 23,
  tests: [
    ['2147483647', 2147483647]
  ]
}

exports['smallint/int2'] = {
  format: 'text',
  id: 21,
  tests: [
    ['32767', 32767]
  ]
}

exports['bigint/int8'] = {
  format: 'text',
  id: 20,
  tests: [
    ['9223372036854775807', '9223372036854775807']
  ]
}

exports.oid = {
  format: 'text',
  id: 26,
  tests: [
    ['103', 103]
  ]
}

const bignum = '31415926535897932384626433832795028841971693993751058.16180339887498948482045868343656381177203091798057628'
exports.numeric = {
  format: 'text',
  id: 1700,
  tests: [
    [bignum, bignum]
  ]
}

exports['real/float4'] = {
  format: 'text',
  id: 700,
  tests: [
    ['123.456', 123.456]
  ]
}

exports['double precision / float 8'] = {
  format: 'text',
  id: 701,
  tests: [
    ['12345678.12345678', 12345678.12345678]
  ]
}

exports.boolean = {
  format: 'text',
  id: 16,
  tests: [
    ['TRUE', true],
    ['t', true],
    ['true', true],
    ['y', true],
    ['yes', true],
    ['on', true],
    ['1', true],
    ['f', false]
  ]
}

exports.timestamptz = {
  format: 'text',
  id: 1184,
  tests: [
    [
      '2010-10-31 14:54:13.74-05:30',
      dateEquals(2010, 9, 31, 20, 24, 13, 740)
    ],
    [
      '2011-01-23 22:05:00.68-06',
      dateEquals(2011, 0, 24, 4, 5, 0, 680)
    ],
    [
      '2010-10-30 14:11:12.730838Z',
      dateEquals(2010, 9, 30, 14, 11, 12, 730)
    ],
    [
      '2010-10-30 13:10:01+05',
      dateEquals(2010, 9, 30, 8, 10, 1, 0)
    ],
    [
      '1000-01-01 00:00:00+00 BC',
      dateEquals(-999, 0, 1, 0, 0, 0, 0)
    ]
  ]
}

exports.timestamp = {
  format: 'text',
  id: 1114,
  tests: [
    [
      '2010-10-31 00:00:00',
      function (t, value) {
        t.equal(
          value.toISOString(),
          '2010-10-31T00:00:00.000Z'
        )
      }
    ],
    [
      '1000-01-01 00:00:00 BC',
      function (t, value) {
        t.equal(
          value.toISOString(),
          '-000999-01-01T00:00:00.000Z'
        )
      }
    ]
  ]
}

exports.date = {
  format: 'text',
  id: 1082,
  tests: [
    ['2010-10-31', '2010-10-31'],
    ['2010-10-31 BC', '2010-10-31 BC']
  ]
}

exports.inet = {
  format: 'text',
  id: 869,
  tests: [
    ['8.8.8.8', '8.8.8.8'],
    ['2001:4860:4860::8888', '2001:4860:4860::8888'],
    ['127.0.0.1', '127.0.0.1'],
    ['fd00:1::40e', 'fd00:1::40e'],
    ['1.2.3.4', '1.2.3.4']
  ]
}

exports.cidr = {
  format: 'text',
  id: 650,
  tests: [
    ['172.16.0.0/12', '172.16.0.0/12'],
    ['fe80::/10', 'fe80::/10'],
    ['fc00::/7', 'fc00::/7'],
    ['192.168.0.0/24', '192.168.0.0/24'],
    ['10.0.0.0/8', '10.0.0.0/8']
  ]
}

exports.macaddr = {
  format: 'text',
  id: 829,
  tests: [
    ['08:00:2b:01:02:03', '08:00:2b:01:02:03'],
    ['16:10:9f:0d:66:00', '16:10:9f:0d:66:00']
  ]
}

exports.numrange = {
  format: 'text',
  id: 3906,
  tests: [
    ['empty', function (t, value) {
      t.deepEqual(value, new Range(null, null, RANGE_EMPTY))
    }],
    ['(,)', function (t, value) {
      t.deepEqual(value, new Range(null, null, RANGE_LB_INF | RANGE_UB_INF))
    }],
    ['(1.5,)', function (t, value) {
      t.deepEqual(value, new Range(1.5, null, RANGE_UB_INF))
    }],
    ['(,1.5)', function (t, value) {
      t.deepEqual(value, new Range(null, 1.5, RANGE_LB_INF))
    }],
    ['(0,5)', function (t, value) {
      t.deepEqual(value, new Range(0, 5, 0))
    }],
    ['(,1.5]', function (t, value) {
      t.deepEqual(value, new Range(null, 1.5, RANGE_LB_INF | RANGE_UB_INC))
    }],
    ['[1.5,)', function (t, value) {
      t.deepEqual(value, new Range(1.5, null, RANGE_LB_INC | RANGE_UB_INF))
    }],
    ['[0,0.5)', function (t, value) {
      t.deepEqual(value, new Range(0, 0.5, RANGE_LB_INC))
    }],
    ['(0,0.5]', function (t, value) {
      t.deepEqual(value, new Range(0, 0.5, RANGE_UB_INC))
    }],
    ['[0,0.5]', function (t, value) {
      t.deepEqual(value, new Range(0, 0.5, RANGE_LB_INC | RANGE_UB_INC))
    }]
  ]
}

exports.int4range = {
  format: 'text',
  id: 3904,
  tests: [
    ['empty', function (t, value) {
      t.deepEqual(value, new Range(null, null, RANGE_EMPTY))
    }],
    ['(,)', function (t, value) {
      t.deepEqual(value, new Range(null, null, RANGE_LB_INF | RANGE_UB_INF))
    }],
    ['(1,)', function (t, value) {
      t.deepEqual(value, new Range(1, null, RANGE_UB_INF))
    }],
    ['(,1)', function (t, value) {
      t.deepEqual(value, new Range(null, 1, RANGE_LB_INF))
    }],
    ['(0,5)', function (t, value) {
      t.deepEqual(value, new Range(0, 5, 0))
    }],
    ['(,1]', function (t, value) {
      t.deepEqual(value, new Range(null, 1, RANGE_LB_INF | RANGE_UB_INC))
    }],
    ['[1,)', function (t, value) {
      t.deepEqual(value, new Range(1, null, RANGE_LB_INC | RANGE_UB_INF))
    }],
    ['[0,5)', function (t, value) {
      t.deepEqual(value, new Range(0, 5, RANGE_LB_INC))
    }],
    ['(0,5]', function (t, value) {
      t.deepEqual(value, new Range(0, 5, RANGE_UB_INC))
    }],
    ['[0,5]', function (t, value) {
      t.deepEqual(value, new Range(0, 5, RANGE_LB_INC | RANGE_UB_INC))
    }]
  ]
}

exports.int8range = {
  format: 'text',
  id: 3926,
  tests: [
    ['empty', function (t, value) {
      t.deepEqual(value, new Range(null, null, RANGE_EMPTY))
    }],
    ['(,)', function (t, value) {
      t.deepEqual(value, new Range(null, null, RANGE_LB_INF | RANGE_UB_INF))
    }],
    ['(1,)', function (t, value) {
      t.deepEqual(value, new Range('1', null, RANGE_UB_INF))
    }],
    ['(,1)', function (t, value) {
      t.deepEqual(value, new Range(null, '1', RANGE_LB_INF))
    }],
    ['(0,5)', function (t, value) {
      t.deepEqual(value, new Range('0', '5', 0))
    }],
    ['(,1]', function (t, value) {
      t.deepEqual(value, new Range(null, '1', RANGE_LB_INF | RANGE_UB_INC))
    }],
    ['[1,)', function (t, value) {
      t.deepEqual(value, new Range('1', null, RANGE_LB_INC | RANGE_UB_INF))
    }],
    ['[0,5)', function (t, value) {
      t.deepEqual(value, new Range('0', '5', RANGE_LB_INC))
    }],
    ['(0,5]', function (t, value) {
      t.deepEqual(value, new Range('0', '5', RANGE_UB_INC))
    }],
    ['[0,5]', function (t, value) {
      t.deepEqual(value, new Range('0', '5', RANGE_LB_INC | RANGE_UB_INC))
    }]
  ]
}

const tsrangeEquals = ([lower, upper]) => {
  const timestamp = date => new Date(Date.UTC.apply(Date, date)).toUTCString()
  return (t, value) => {
    if (lower !== null) {
      t.equal(value.lower.toUTCString(), timestamp(lower))
    }
    if (upper !== null) {
      t.equal(value.upper.toUTCString(), timestamp(upper))
    }
  }
}
exports.tstzrange = {
  format: 'text',
  id: 3910,
  tests: [
    ['(2010-10-31 14:54:13.74-05:30,)', tsrangeEquals([[2010, 9, 31, 20, 24, 13, 74], null])],
    ['(,2010-10-31 14:54:13.74-05:30)', tsrangeEquals([null, [2010, 9, 31, 20, 24, 13, 74]])],
    ['(2010-10-30 10:54:13.74-05:30,2010-10-31 14:54:13.74-05:30)', tsrangeEquals([[2010, 9, 30, 16, 24, 13, 74], [2010, 9, 31, 20, 24, 13, 74]])],
    ['("2010-10-31 14:54:13.74-05:30",)', tsrangeEquals([[2010, 9, 31, 20, 24, 13, 74], null])],
    ['(,"2010-10-31 14:54:13.74-05:30")', tsrangeEquals([null, [2010, 9, 31, 20, 24, 13, 74]])],
    ['("2010-10-30 10:54:13.74-05:30","2010-10-31 14:54:13.74-05:30")', tsrangeEquals([[2010, 9, 30, 16, 24, 13, 74], [2010, 9, 31, 20, 24, 13, 74]])]
  ]
}
exports.tsrange = {
  format: 'text',
  id: 3908,
  tests: [
    ['(2010-10-31 14:54:13.74,)', tsrangeEquals([[2010, 9, 31, 14, 54, 13, 74], null])],
    ['(2010-10-31 14:54:13.74,infinity)', tsrangeEquals([[2010, 9, 31, 14, 54, 13, 74], null])],
    ['(,2010-10-31 14:54:13.74)', tsrangeEquals([null, [2010, 9, 31, 14, 54, 13, 74]])],
    ['(-infinity,2010-10-31 14:54:13.74)', tsrangeEquals([null, [2010, 9, 31, 14, 54, 13, 74]])],
    ['(2010-10-30 10:54:13.74,2010-10-31 14:54:13.74)', tsrangeEquals([[2010, 9, 30, 10, 54, 13, 74], [2010, 9, 31, 14, 54, 13, 74]])],
    ['("2010-10-31 14:54:13.74",)', tsrangeEquals([[2010, 9, 31, 14, 54, 13, 74], null])],
    ['("2010-10-31 14:54:13.74",infinity)', tsrangeEquals([[2010, 9, 31, 14, 54, 13, 74], null])],
    ['(,"2010-10-31 14:54:13.74")', tsrangeEquals([null, [2010, 9, 31, 14, 54, 13, 74]])],
    ['(-infinity,"2010-10-31 14:54:13.74")', tsrangeEquals([null, [2010, 9, 31, 14, 54, 13, 74]])],
    ['("2010-10-30 10:54:13.74","2010-10-31 14:54:13.74")', tsrangeEquals([[2010, 9, 30, 10, 54, 13, 74], [2010, 9, 31, 14, 54, 13, 74]])]
  ]
}
exports.daterange = {
  format: 'text',
  id: 3912,
  tests: [
    ['(2010-10-31,)', function (t, value) {
      t.deepEqual(value, new Range('2010-10-31', null, RANGE_UB_INF))
    }],
    ['(,2010-10-31)', function (t, value) {
      t.deepEqual(value, new Range(null, '2010-10-31', RANGE_LB_INF))
    }],
    ['[2010-10-30,2010-10-31]', function (t, value) {
      t.deepEqual(value, new Range('2010-10-30', '2010-10-31', RANGE_LB_INC | RANGE_UB_INC))
    }]
  ]
}

function toPostgresInterval (obj) {
  const base = Object.create(PostgresInterval.prototype)
  return Object.assign(base, obj)
}
exports.interval = {
  format: 'text',
  id: 1186,
  tests: [
    ['01:02:03', function (t, value) {
      t.equal(value.toPostgres(), '3 seconds 2 minutes 1 hours')
      t.deepEqual(value, toPostgresInterval({ years: 0, months: 0, days: 0, hours: 1, minutes: 2, seconds: 3, milliseconds: 0 }))
    }],
    ['01:02:03.456', function (t, value) {
      t.deepEqual(value, toPostgresInterval({ years: 0, months: 0, days: 0, hours: 1, minutes: 2, seconds: 3, milliseconds: 456 }))
    }],
    ['1 year -32 days', function (t, value) {
      t.equal(value.toPostgres(), '-32 days 1 years')
      t.deepEqual(value, toPostgresInterval({ years: 1, months: 0, days: -32, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }))
    }],
    ['1 day -00:00:03', function (t, value) {
      t.equal(value.toPostgres(), '-3 seconds 1 days')
      t.deepEqual(value, toPostgresInterval({ years: 0, months: 0, days: 1, hours: -0, minutes: -0, seconds: -3, milliseconds: -0 }))
    }]
  ]
}

exports.bytea = {
  format: 'text',
  id: 17,
  tests: [
    ['foo\\000\\200\\\\\\377', function (t, value) {
      const buffer = Buffer.from([102, 111, 111, 0, 128, 92, 255])
      t.ok(buffer.equals(value))
    }],
    ['', function (t, value) {
      const buffer = Buffer.from([])
      t.ok(buffer.equals(value))
    }]
  ]
}

exports['array/boolean'] = {
  format: 'text',
  id: 1000,
  tests: [
    ['{true,false}', function (t, value) {
      t.deepEqual(value, [true, false])
    }]
  ]
}

exports['array/char'] = {
  format: 'text',
  id: 1014,
  tests: [
    ['{foo,bar}', function (t, value) {
      t.deepEqual(value, ['foo', 'bar'])
    }]
  ]
}

exports['array/varchar'] = {
  format: 'text',
  id: 1015,
  tests: [
    ['{foo,bar}', function (t, value) {
      t.deepEqual(value, ['foo', 'bar'])
    }]
  ]
}

exports['array/text'] = {
  format: 'text',
  id: 1008,
  tests: [
    ['{foo}', function (t, value) {
      t.deepEqual(value, ['foo'])
    }]
  ]
}

exports['array/bytea'] = {
  format: 'text',
  id: 1001,
  tests: [
    ['{"\\\\x00000000"}', function (t, value) {
      const buffer = Buffer.from('00000000', 'hex')
      t.ok(Array.isArray(value))
      t.equal(value.length, 1)
      t.ok(buffer.equals(value[0]))
    }],
    ['{NULL,"\\\\x4e554c4c"}', function (t, value) {
      const buffer = Buffer.from('4e554c4c', 'hex')
      t.ok(Array.isArray(value))
      t.equal(value.length, 2)
      t.equal(value[0], null)
      t.ok(buffer.equals(value[1]))
    }]
  ]
}

exports['array/numeric'] = {
  format: 'text',
  id: 1231,
  tests: [
    ['{1.2,3.4}', function (t, value) {
      t.deepEqual(value, ['1.2', '3.4'])
    }]
  ]
}

exports['array/int2'] = {
  format: 'text',
  id: 1005,
  tests: [
    ['{-32768, -32767, 32766, 32767}', function (t, value) {
      t.deepEqual(value, [-32768, -32767, 32766, 32767])
    }]
  ]
}

exports['array/int4'] = {
  format: 'text',
  id: 1005,
  tests: [
    ['{-2147483648, -2147483647, 2147483646, 2147483647}', function (t, value) {
      t.deepEqual(value, [-2147483648, -2147483647, 2147483646, 2147483647])
    }]
  ]
}

exports['array/int8'] = {
  format: 'text',
  id: 1016,
  tests: [
    [
      '{-9223372036854775808, -9223372036854775807, 9223372036854775806, 9223372036854775807}',
      function (t, value) {
        t.deepEqual(value, [
          '-9223372036854775808',
          '-9223372036854775807',
          '9223372036854775806',
          '9223372036854775807'
        ])
      }
    ]
  ]
}

exports['array/json'] = {
  format: 'text',
  id: 199,
  tests: [
    [
      '{{1,2},{[3],"[4,5]"},{null,NULL}}',
      function (t, value) {
        t.deepEqual(value, [
          [1, 2],
          [[3], [4, 5]],
          [null, null]
        ])
      }
    ]
  ]
}

exports['array/jsonb'] = {
  format: 'text',
  id: 3807,
  tests: exports['array/json'].tests
}

exports['array/point'] = {
  format: 'text',
  id: 1017,
  tests: [
    ['{"(25.1,50.5)","(10.1,40)"}', function (t, value) {
      t.deepEqual(value, [{ x: 25.1, y: 50.5 }, { x: 10.1, y: 40 }])
    }]
  ]
}

exports['array/oid'] = {
  format: 'text',
  id: 1028,
  tests: [
    ['{25864,25860}', function (t, value) {
      t.deepEqual(value, [25864, 25860])
    }]
  ]
}

exports['array/float4'] = {
  format: 'text',
  id: 1021,
  tests: [
    ['{1.2, 3.4}', function (t, value) {
      t.deepEqual(value, [1.2, 3.4])
    }]
  ]
}

exports['array/float8'] = {
  format: 'text',
  id: 1022,
  tests: [
    ['{-12345678.1234567, 12345678.12345678}', function (t, value) {
      t.deepEqual(value, [-12345678.1234567, 12345678.12345678])
    }]
  ]
}

exports['array/date'] = {
  format: 'text',
  id: 1182,
  tests: [
    ['{2014-01-01,2015-12-31}', function (t, value) {
      t.deepEqual(value, ['2014-01-01', '2015-12-31'])
    }]
  ]
}

exports['array/interval'] = {
  format: 'text',
  id: 1187,
  tests: [
    ['{01:02:03,1 day -00:00:03}', function (t, value) {
      const expecteds = [toPostgresInterval({ years: 0, months: 0, days: 0, hours: 1, minutes: 2, seconds: 3, milliseconds: 0 }),
        toPostgresInterval({ years: 0, months: 0, days: 1, hours: -0, minutes: -0, seconds: -3, milliseconds: -0 })]
      t.equal(value.length, 2)
      t.deepEqual(value, expecteds)
    }]
  ]
}

exports['array/inet'] = {
  format: 'text',
  id: 1041,
  tests: [
    ['{8.8.8.8}', function (t, value) {
      t.deepEqual(value, ['8.8.8.8'])
    }],
    ['{2001:4860:4860::8888}', function (t, value) {
      t.deepEqual(value, ['2001:4860:4860::8888'])
    }],
    ['{127.0.0.1,fd00:1::40e,1.2.3.4}', function (t, value) {
      t.deepEqual(value, ['127.0.0.1', 'fd00:1::40e', '1.2.3.4'])
    }]
  ]
}

exports['array/cidr'] = {
  format: 'text',
  id: 651,
  tests: [
    ['{172.16.0.0/12}', function (t, value) {
      t.deepEqual(value, ['172.16.0.0/12'])
    }],
    ['{fe80::/10}', function (t, value) {
      t.deepEqual(value, ['fe80::/10'])
    }],
    ['{10.0.0.0/8,fc00::/7,192.168.0.0/24}', function (t, value) {
      t.deepEqual(value, ['10.0.0.0/8', 'fc00::/7', '192.168.0.0/24'])
    }]
  ]
}

exports['array/macaddr'] = {
  format: 'text',
  id: 1040,
  tests: [
    ['{08:00:2b:01:02:03,16:10:9f:0d:66:00}', function (t, value) {
      t.deepEqual(value, ['08:00:2b:01:02:03', '16:10:9f:0d:66:00'])
    }]
  ]
}

exports['array/numrange'] = {
  format: 'text',
  id: 3907,
  tests: [
    ['{"[1,2]","(4.5,8)","[10,40)","(-21.2,60.3]"}', function (t, value) {
      t.deepEqual(value, ['[1,2]', '(4.5,8)', '[10,40)', '(-21.2,60.3]'])
    }],
    ['{"[,20]","[3,]","[,]","(,35)","(1,)","(,)"}', function (t, value) {
      t.deepEqual(value, ['[,20]', '[3,]', '[,]', '(,35)', '(1,)', '(,)'])
    }],
    ['{"[,20)","[3,)","[,)","[,35)","[1,)","[,)"}', function (t, value) {
      t.deepEqual(value, ['[,20)', '[3,)', '[,)', '[,35)', '[1,)', '[,)'])
    }]
  ]
}

exports['binary-string/varchar'] = {
  format: 'binary',
  id: 1043,
  tests: [
    ['bang', 'bang']
  ]
}

exports['binary-integer/int4'] = {
  format: 'binary',
  id: 23,
  tests: [
    [[0, 0, 0, 100], 100]
  ]
}

exports['binary-smallint/int2'] = {
  format: 'binary',
  id: 21,
  tests: [
    [[0, 101], 101]
  ]
}

exports['binary-bigint/int8'] = {
  format: 'binary',
  id: 20,
  tests: [
    [Buffer.from([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), '9223372036854775807']
  ]
}

exports['binary-oid'] = {
  format: 'binary',
  id: 26,
  tests: [
    [[0, 0, 0, 103], 103]
  ]
}

exports['binary-numeric'] = {
  format: 'binary',
  id: 1700,
  tests: [
    [
      [0, 2, 0, 0, 0, 0, 0, 0x64, 0, 12, 0xd, 0x48],
      '12.3400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    ]
  ]
}

exports['binary-real/float4'] = {
  format: 'binary',
  id: 700,
  tests: [
    [[0x41, 0x48, 0x00, 0x00], 12.5]
  ]
}

exports['binary-boolean'] = {
  format: 'binary',
  id: 16,
  tests: [
    [[1], true],
    [[0], false]
  ]
}

exports['binary-string'] = {
  format: 'binary',
  id: 25,
  tests: [
    [
      Buffer.from([0x73, 0x6c, 0x61, 0x64, 0x64, 0x61]),
      'sladda'
    ]
  ]
}

exports['binary-array/int4'] = {
  format: 'binary',
  id: 1007,
  tests: [
    [
      Buffer.from([
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0x17, // int4[]
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 4, 0xff, 0xff, 0xff, 0xff
      ]),
      function (t, value) {
        t.deepEqual(value, [-1])
      }
    ]
  ]
}

exports['binary-array/int8'] = {
  format: 'binary',
  id: 1016,
  tests: [
    [
      Buffer.from([
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0x14, // int8[]
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 8, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
      ]),
      function (t, value) {
        t.deepEqual(value, ['-1'])
      }
    ],
    [
      Buffer.from([
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0x14, // int8[]
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 8, 0x01, 0xb6, 0x9b, 0x4b, 0xac, 0xd0, 0x5f, 0x15
      ]),
      function (t, value) {
        t.deepEqual(value, ['123456789123456789'])
      }
    ]
  ]
}

exports.point = {
  format: 'text',
  id: 600,
  tests: [
    ['(25.1,50.5)', function (t, value) {
      t.deepEqual(value, { x: 25.1, y: 50.5 })
    }]
  ]
}

exports.circle = {
  format: 'text',
  id: 718,
  tests: [
    ['<(25,10),5>', function (t, value) {
      t.deepEqual(value, { x: 25, y: 10, radius: 5 })
    }]
  ]
}

function dateEquals () {
  const timestamp = Date.UTC.apply(Date, arguments)
  return function (t, value) {
    t.equal(value.toUTCString(), new Date(timestamp).toUTCString())
  }
}
