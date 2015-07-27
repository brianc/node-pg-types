var array = require('postgres-array')
var ap = require('ap')
var arrayParser = require(__dirname + "/arrayParser.js");
var parseDate = require('postgres-date');
var parseInterval = require('postgres-interval');
var parseByteA = require('postgres-bytea');

function allowNull (fn) {
  return function nullAllowed (value) {
    if (value === null) return value
    return fn(value)
  }
}

function parseBool (value) {
  if (value === null) return value
  return value === 't';
}

function parseBoolArray (value) {
  if (!value) return null
  return array.parse(value, parseBool)
}

function parseIntegerArray (value) {
  if (!value) return null
  return array.parse(value, allowNull(ap.partialRight(parseInt, 10)))
}

function parseBigIntegerArray (value) {
  if (!value) return null
  return array.parse(val, allowNull(function (item) {
    return parseBigInteger(entry).trim()
  }))
}

var parseFloatArray = function(val) {
  if(!val) { return null; }
  var p = arrayParser.create(val, function(entry) {
    if(entry !== null) {
      entry = parseFloat(entry);
    }
    return entry;
  });

  return p.parse();
};

var parseStringArray = function(val) {
  if(!val) { return null; }

  var p = arrayParser.create(val);
  return p.parse();
};

var parseDateArray = function(val) {
  if (!val) { return null; }

  var p = arrayParser.create(val, function(entry) {
    if (entry !== null) {
      entry = parseDate(entry);
    }
    return entry;
  });

  return p.parse();
};

var parseByteAArray = function(val) {
  var arr = parseStringArray(val);
  if (!arr) return arr;

  return arr.map(function(element) {
    return parseByteA(element);
  });
};

var parseInteger = function(val) {
  return parseInt(val, 10);
};

var parseBigInteger = function(val) {
  var valStr = String(val);
  if (/^\d+$/.test(valStr)) { return valStr; }
  return val;
};

var parseJsonArray = function(val) {
  var arr = parseStringArray(val);

  if (!arr) {
    return arr;
  }

  return arr.map(function(el) { return JSON.parse(el); });
};

var parsePoint = function(val) {
  if (val[0] !== '(') { return null; }

  val = val.substring( 1, val.length - 1 ).split(',');

  return {
    x: parseFloat(val[0])
  , y: parseFloat(val[1])
  };
};

var parseCircle = function(val) {
  if (val[0] !== '<' && val[1] !== '(') { return null; }

  var point = '(';
  var radius = '';
  var pointParsed = false;
  for (var i = 2; i < val.length - 1; i++){
    if (!pointParsed) {
      point += val[i];
    }

    if (val[i] === ')') {
      pointParsed = true;
      continue;
    } else if (!pointParsed) {
      continue;
    }

    if (val[i] === ','){
      continue;
    }

    radius += val[i];
  }
  var result = parsePoint(point);
  result.radius = parseFloat(radius);

  return result;
};

var init = function(register) {
  register(20, parseBigInteger); // int8
  register(21, parseInteger); // int2
  register(23, parseInteger); // int4
  register(26, parseInteger); // oid
  register(700, parseFloat); // float4/real
  register(701, parseFloat); // float8/double
  register(16, parseBool);
  register(1082, parseDate); // date
  register(1114, parseDate); // timestamp without timezone
  register(1184, parseDate); // timestamp
  register(600, parsePoint); // point
  register(718, parseCircle); // circle
  register(1000, parseBoolArray);
  register(1001, parseByteAArray);
  register(1005, parseIntegerArray); // _int2
  register(1007, parseIntegerArray); // _int4
  register(1016, parseBigIntegerArray); // _int8
  register(1021, parseFloatArray); // _float4
  register(1022, parseFloatArray); // _float8
  register(1231, parseFloatArray); // _numeric
  register(1014, parseStringArray); //char
  register(1015, parseStringArray); //varchar
  register(1008, parseStringArray);
  register(1009, parseStringArray);
  register(1115, parseDateArray); // timestamp without time zone[]
  register(1182, parseDateArray); // _date
  register(1185, parseDateArray); // timestamp with time zone[]
  register(1186, parseInterval);
  register(17, parseByteA);
  register(114, JSON.parse.bind(JSON)); // json
  register(3802, JSON.parse.bind(JSON)); // jsonb
  register(199, parseJsonArray); // json[]
  register(3807, parseJsonArray); // jsonb[]
  register(2951, parseStringArray); // uuid[]
  register(791, parseStringArray); // money[]
  register(1183, parseStringArray); // time[]
};

module.exports = {
  init: init
};
