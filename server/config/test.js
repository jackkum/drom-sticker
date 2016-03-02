'use strict';

import mongoose from 'mongoose';
import config from './environment';
import _ from 'lodash';
import fs from 'fs';
import request from 'request';
import * as drom from '../drom/drom.service';
	
mongoose.set('debug', true);
mongoose.connect(config.mongo.uri, config.mongo.options);

//var name = 'loggedinuser';
//var str  = '<input type="hidden" name="loggedinuser" value="311434" />';
//var reg  = new RegExp('<input type="hidden" name="' + name + '" value="([^"]*)" />');
//console.log(str.match(reg));

var theme = 1151343041;

request.get('https://drom-sticker.herokuapp.com/api/items/image/56d5353555b675030062a9a3', function(err, response, body){
  if(err){
    return console.error(err);
  }

  var type     = response.headers['content-type'];
  var filename = '56d5353555b675030062a9a3.'  + type.split('/')[1];
  var path     = '/tmp/' + filename;
  fs.writeFileSync(path, body);

  drom.postAttachment(theme, {
    value:  fs.createReadStream(path),
    options: {
      filename: filename,
      contentType: type
    }
  })
    .then(attachmentId => {
      console.log(attachmentId);
    })
    .catch(err => {
      console.error(err);
    });
});


//var message = "Всем привет, меня зовут бот-счетовод )))\n\nhttps://drom-sticker.herokuapp.com/";

//drom.postMessage(message, 1151343041)
//.then(() => {
//  console.log("Done");
//})
//.catch(err => {
//  console.error(err);
//});