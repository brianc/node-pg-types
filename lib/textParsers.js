var array = require('postgres-array')
var parseDate = require('postgres-date')
var parseInterval = require('postgres-interval')
var parseByteA = require('postgres-bytea')

function parseBool (value) {
  if (value === null) return value
  return value === 'TRUE' ||
    value === 't' ||
    value === 'true' ||
    value === 'y' ||
    value === 'yes' ||
    value === 'on' ||
    value === '1'
}

function parseBoolArray (value) {
  if (!value) return null
  return array.parse(value, parseBool)
}

function parseBaseTenInt (string) {
  return parseInt(string, 10)
}

function parseIntegerArray (value) {
  if (!value) return null
  return array.parse(value, parseBaseTenInt)
}

function parseBigIntegerArray (value) {
  if (!value) return null
  return array.parse(value, function (entry) {
    return parseBigInteger(entry).trim()
  })
}

var parsePointArray = function (value) {
  if (!value) { return null }
  return array.parse(value, parsePoint)
}

var parseFloatArray = function (value) {
  if (!value) { return null }
  return array.parse(value, parseFloat)
}

var parseStringArray = function (value) {
  if (!value) { return null }
  return array.parse(value, undefined)
}

var parseDateArray = function (value) {
  if (!value) { return null }
  return array.parse(value, parseDate)
}

var parseIntervalArray = function (value) {
  if (!value) { return null }
  return array.parse(value, parseInterval)
}

var parseByteAArray = function (value) {
  if (!value) { return null }
  return array.parse(value, parseByteA)
}

var parseBigInteger = function (value) {
  var valStr = String(value)
  if (/^\d+$/.test(valStr)) { return valStr }
  return value
}

var parseJsonArray = function (value) {
  if (!value) { return null }
  return array.parse(value, JSON.parse)
}

var parsePoint = function (value) {
  if (value[0] !== '(') { return null }

  value = value.substring(1, value.length - 1).split(',')

  return {
    x: parseFloat(value[0]),
    y: parseFloat(value[1])
  }
}

var parseCircle = function (value) {
  if (value[0] !== '<' && value[1] !== '(') { return null }

  var point = '('
  var radius = ''
  var pointParsed = false
  for (var i = 2; i < value.length - 1; i++) {
    if (!pointParsed) {
      point += value[i]
    }

    if (value[i] === ')') {
      pointParsed = true
      continue
    } else if (!pointParsed) {
      continue
    }

    if (value[i] === ',') {
      continue
    }

    radius += value[i]
  }
  var result = parsePoint(point)
  result.radius = parseFloat(radius)

  return result
}

var init = function (register) {
  register(20, parseBigInteger) // int8
  register(21, parseBaseTenInt) // int2
  register(23, parseBaseTenInt) // int4
  register(26, parseBaseTenInt) // oid
  register(700, parseFloat) // float4/real
  register(701, parseFloat) // float8/double
  register(16, parseBool)
  register(1082, parseDate) // date
  register(1114, parseDate) // timestamp without timezone
  register(1184, parseDate) // timestamp
  register(600, parsePoint) // point
  register(651, parseStringArray) // cidr[]
  register(718, parseCircle) // circle
  register(1000, parseBoolArray)
  register(1001, parseByteAArray)
  register(1005, parseIntegerArray) // _int2
  register(1007, parseIntegerArray) // _int4
  register(1028, parseIntegerArray) // oid[]
  register(1016, parseBigIntegerArray) // _int8
  register(1017, parsePointArray) // point[]
  register(1021, parseFloatArray) // _float4
  register(1022, parseFloatArray) // _float8
  register(1231, parseStringArray) // _numeric
  register(1014, parseStringArray) // char
  register(1015, parseStringArray) // varchar
  register(1008, parseStringArray)
  register(1009, parseStringArray)
  register(1040, parseStringArray) // macaddr[]
  register(1041, parseStringArray) // inet[]
  register(1115, parseDateArray) // timestamp without time zone[]
  register(1182, parseDateArray) // _date
  register(1185, parseDateArray) // timestamp with time zone[]
  register(1186, parseInterval)
  register(1187, parseIntervalArray)
  register(17, parseByteA)
  register(114, JSON.parse) // json
  register(3802, JSON.parse) // jsonb
  register(199, parseJsonArray) // json[]
  register(3807, parseJsonArray) // jsonb[]
  register(3907, parseStringArray) // numrange[]
  register(2951, parseStringArray) // uuid[]
  register(791, parseStringArray) // money[]
  register(1183, parseStringArray) // time[]
  register(1270, parseStringArray) // timetz[]
}

module.exports = {
  init: init
}
