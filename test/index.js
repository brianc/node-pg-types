
const test = require('tape')
const { getTypeParser, setTypeParser } = require('../')
const types = require('./types')

test('types', function (t) {
  Object.keys(types).forEach(function (typeName) {
    const type = types[typeName]
    t.test(typeName, function (t) {
      const parser = getTypeParser(type.id, type.format)
      type.tests.forEach(function (tests) {
        let input = tests[0]
        if (type.format === 'binary' && input !== null && !Buffer.isBuffer(input)) {
          if (Array.isArray(input) || typeof (input) === 'string') {
            input = Buffer.from(input)
          } else {
            throw new Error('Binary test inputs must be null, a String, a Buffer, or an Array')
          }
        }
        const expected = tests[1]
        const result = parser(input)
        if (typeof expected === 'function') {
          return expected(t, result)
        }
        t.equal(result, expected)
      })
      t.end()
    })
  })

  t.test('binary array bits overflow', function (t) {
    const parser = getTypeParser(1009, 'binary')

    const expected = 'a'.repeat(1000000)

    const input = Buffer.alloc(20 + 300 * (4 + expected.length))
    input.write(
      '\x00\x00\x00\x01' + // 1 dimension
      '\x00\x00\x00\x00' + // no nulls
      '\x00\x00\x00\x19' + // text[]
      '\x00\x00\x01\x2c' + // 300 elements
      '\x00\x00\x00\x01', // lower bound 1
      0,
      'binary'
    )

    for (let offset = 20; offset < input.length; offset += 4 + expected.length) {
      input.write('\x00\x0f\x42\x40', offset, 'binary')
      input.write(expected, offset + 4, 'utf8')
    }

    const result = parser(input)

    t.equal(result.length, 300)

    let correct = 0

    result.forEach(function (element) {
      if (element === expected) {
        correct++
      }
    })

    t.equal(correct, 300)
    t.end()
  })

  t.test('setTypeParser should throw when oid is not an integer', function (t) {
    t.throws(function () {
      setTypeParser(null, function () {})
    }, /^TypeError: oid must be an integer/)
    t.throws(function () {
      setTypeParser('a', function () {})
    }, /^TypeError: oid must be an integer/)
    t.end()
  })
})
