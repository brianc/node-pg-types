var array = require('postgres-array');

module.exports = {
  create: function (source, transform) {
    return {
      parse: array.parse
    };
  }
};
