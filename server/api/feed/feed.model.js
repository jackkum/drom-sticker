'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var FeedSchema = new mongoose.Schema({
  name: String,
  type: String,
  dtime: Date,
  shooter: {
  	id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	comment: String
  },
  victim: {
  	id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	comment: String
  }
});

export default mongoose.model('Feed', FeedSchema);
