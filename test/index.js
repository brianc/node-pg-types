
var test = require('tape')
var getTypeParser = require('../').getTypeParser
var types = require('./types')

test('types', function (t) {
  Object.keys(types).forEach(function (typeName) {
    var type = types[typeName]
    t.test(typeName, function (t) {
      var parser = getTypeParser(type.id, type.format)
      type.tests.forEach(function (tests) {
        var input = tests[0]
        if (type.format === 'binary' && input !== null && !Buffer.isBuffer(input)) {
          if (Array.isArray(input) || typeof(input) === 'string') {
            input = Buffer.from(input)
          } else {
            throw new Error('Binary test inputs must be null, a String, a Buffer, or an Array')
          }
        }
        var expected = tests[1]
        var result = parser(input)
        if (typeof expected === 'function') {
          return expected(t, result)
        }
        t.equal(result, expected)
      })
      t.end()
    })
  })

  t.test('binary array bits overflow', function (t) {
    var parser = getTypeParser(1009, 'binary')

    var expected = 'a'.repeat(1000000)

    var input = Buffer.alloc(20 + 300 * (4 + expected.length))
    input.write(
      '\x00\x00\x00\x01' +  // 1 dimension
      '\x00\x00\x00\x00' +  // no nulls
      '\x00\x00\x00\x19' +  // text[]
      '\x00\x00\x01\x2c' +  // 300 elements
      '\x00\x00\x00\x01',   // lower bound 1
      0,
      'binary'
    )

    for (var offset = 20; offset < input.length; offset += 4 + expected.length) {
      input.write('\x00\x0f\x42\x40', offset, 'binary')
      input.write(expected, offset + 4, 'utf8')
    }

    var result = parser(input)

    t.equal(result.length, 300)

    var correct = 0

    result.forEach(function (element) {
      if (element === expected) {
        correct++
      }
    })

    t.equal(correct, 300)
    t.end()
  })
})
