'use strict';

// Set default node environment to development || production
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'production';

//if (env === 'development' || env === 'test') {
  // Register the Babel require hook
  require('babel-core/register');
//}

// Export the application
exports = module.exports = require('./' + process.argv[2]);
