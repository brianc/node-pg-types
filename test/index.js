
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
})
