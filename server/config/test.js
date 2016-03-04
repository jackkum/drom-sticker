'use strict';

import mongoose from 'mongoose';
import config from './environment';
import _ from 'lodash';
import fs from 'fs';
import request from 'request';
import * as drom from '../drom/drom.service';
import Item from '../api/item/item.model';
import async from 'async';
	
mongoose.set('debug', true);
mongoose.connect(config.mongo.uri, config.mongo.options);

var theme = 1151343041,
    last  = 1113;

var pages = [];
for(var p = last; p > 1000; p--){
  pages.push(p);
}

async.each(pages, (page, next) => {
  drom
    .login()
    .then(() => {
      return drom.getTheme(theme, page);
    })
    .then(response => {
      console.log(response.body);
      var match = response.body.match(/<div class="postdetails">(.*)<\/div>/g);
      if( ! match){
        next(new Error('Users not found'));
      }

      match.forEach(content => {
        console.log(content);
      });

      next();
    });
}, err => {
  if(err){
    console.error(err);
    process.exit(1);
  }

  process.exit();
});

/*
Item.findByIdAsync('56d5353555b675030062a9a3')
  .then(item => {
    if( ! item){
      throw new Error("Item not found!");
    }

    var message = 'Сдаюсь! ((( \n\n\n[URL="http://' + item.picture.url + '"][IMG]http://' + item.picture.thumb + '[/IMG][/URL]';

    return drom
      .postMessage(message, theme)
      .then(() => {
        console.log("Done");
      });
  });
*/

//


//var message = "Всем привет, меня зовут бот-счетовод )))\n\nhttps://drom-sticker.herokuapp.com/";

//drom.postMessage(message, 1151343041)
//.then(() => {
//  console.log("Done");
//})
//.catch(err => {
//  console.error(err);
//});