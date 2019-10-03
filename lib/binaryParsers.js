var parseInt64 = require('pg-int8')
var parseNumeric = require('pg-numeric')

var parseInt16 = function (value) {
  return value.readInt16BE(0)
}

var parseInt32 = function (value) {
  return value.readInt32BE(0)
}

var parseFloat32 = function (value) {
  return value.readFloatBE(0)
}

var parseFloat64 = function (value) {
  return value.readDoubleBE(0)
}

var parseDate = function (isUTC, value) {
  var rawValue = 0x100000000 * value.readInt32BE(0) + value.readUInt32BE(4)

  // discard usecs and shift from 2000 to 1970
  var result = new Date((rawValue / 1000) + 946684800000)

  if (!isUTC) {
    result.setTime(result.getTime() + result.getTimezoneOffset() * 60000)
  }

  // add microseconds to the date
  result.usec = rawValue % 1000
  result.getMicroSeconds = function () {
    return this.usec
  }
  result.setMicroSeconds = function (value) {
    this.usec = value
  }
  result.getUTCMicroSeconds = function () {
    return this.usec
  }

  return result
}

var parseArray = function (value) {
  var dim = value.readInt32BE(0)

  var elementType = value.readUInt32BE(8)

  var offset = 12
  var dims = []
  for (var i = 0; i < dim; i++) {
    // parse dimension
    dims[i] = value.readInt32BE(offset)
    offset += 4

    // ignore lower bounds
    offset += 4
  }

  var parseElement = function (elementType) {
    // parse content length
    var length = value.readInt32BE(offset)
    offset += 4

    // parse null values
    if (length === -1) {
      return null
    }

    var result
    if (elementType === 0x17) {
      // int
      result = value.readInt32BE(offset)
      offset += length
      return result
    } else if (elementType === 0x14) {
      // bigint
      result = parseInt64(value.slice(offset, offset += length))
      return result
    } else if (elementType === 0x19) {
      // string
      result = value.toString('utf8', offset, offset += length)
      return result
    } else {
      throw new Error('ElementType not implemented: ' + elementType)
    }
  }

  var parse = function (dimension, elementType) {
    var array = []
    var i

    if (dimension.length > 1) {
      var count = dimension.shift()
      for (i = 0; i < count; i++) {
        array[i] = parse(dimension, elementType)
      }
      dimension.unshift(count)
    } else {
      for (i = 0; i < dimension[0]; i++) {
        array[i] = parseElement(elementType)
      }
    }

    return array
  }

  return parse(dims, elementType)
}

var parseText = function (value) {
  return value.toString('utf8')
}

var parseBool = function (value) {
  if (value === null) return null
  return value[0] !== 0
}

var init = function (register) {
  register(20, parseInt64)
  register(21, parseInt16)
  register(23, parseInt32)
  register(26, parseInt32)
  register(1700, parseNumeric)
  register(700, parseFloat32)
  register(701, parseFloat64)
  register(16, parseBool)
  register(1114, parseDate.bind(null, false))
  register(1184, parseDate.bind(null, true))
  register(1000, parseArray)
  register(1007, parseArray)
  register(1016, parseArray)
  register(1008, parseArray)
  register(1009, parseArray)
  register(25, parseText)
}

module.exports = {
  init: init
}
