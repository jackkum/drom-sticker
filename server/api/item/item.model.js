'use strict';

var mongoose    = require('bluebird').promisifyAll(require('mongoose'));
var User        = require('../user/user.model');
var config      = require('../../config/environment');
var moment      = require('moment');
var request     = require('request');
var _           = require('lodash');
var fs          = require('fs');
var nodemailer  = require('nodemailer');
var transporter = nodemailer.createTransport();
var drom        = require('../../drom/drom.service');

moment.locale('RU');

var ItemSchema = new mongoose.Schema({
  dtime: Date,
  type: {type: String, default: 'shoot'},
  picture: {
    url: String,
    thumb: String
  },
  shooter: {
  	id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	comment: String
  },
  victim: {
  	id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	comment: String,
  	confirm: {type: Boolean, default: false},
    cancel: {type: Boolean, default: false}
  }
});

ItemSchema.pre('save', function(next) {
  
  if( ! this.isNew){
    return next();
  }

  this.victim.cancel = this.victim.confirm = false;
  
  next();

  var self = this;

  Promise.all([
    User.findByIdAsync(this.shooter.id),
    User.findByIdAsync(this.victim.id)
  ])
    .then(values => {
      
      var shooter = values.shift(),
          victim  = values.shift();

      if( ! shooter){
        throw new Error('Shooter not found');
      }

      if( ! victim){
        throw new Error('Victim not found');
      }

      transporter.sendMail({
        from: '"' + shooter.name + '" <drom-sticker@mail.ru>',
        to: '"' + victim.name + '" <' + victim.email + '>',
        subject: (self.type === 'shoot' ? 'Выстрел' : 'Мина') + ', ' + moment(self.dtime).add(8, 'hours').format("ddd, DD MMMM YYYY HH:mm"),
        text: self.shooter.comment,
      }, function(err, info){
        if(err){
          return console.error(err);
        }
        
      });

      var shooterName = '[COLOR="#00FF00"]' + shooter.name + '[/COLOR]',
          victimName  = '[COLOR="#FF0000"]' + victim.name + '[/COLOR]';

      if(shooter.dromId){
        shooterName = '[url=http://forums.drom.ru/member.php?u=' + shooter.dromId + ']' + shooterName + '[/url]';
      }

      if(victim.dromId){
        victimName = '[url=http://forums.drom.ru/member.php?u=' + victim.dromId + ']' + victimName + '[/url]';
      }

      var message = "[B]" + (self.type === 'shoot' ? 'Выстрел' : 'Мина') + "[/B]\n" 
              + victimName + " был подбит " + shooterName + ", " + moment(self.dtime).add(8, 'hours').format("ddd, DD MMMM YYYY HH:mm") + "\n"
              + (self.shooter.comment || '') + "\n\n";

      if(self._id && self.picture && self.picture.url){
        message += '[URL="http://' + self.picture.url + '"][IMG]http://' + self.picture.thumb + '[/IMG][/URL]';
      }

      console.log("Start sync with drom.ru");
      drom
        .postMessage(message, config.drom.theme)
        .then(() => {
          console.log("Done");
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(console.error);
});

export default mongoose.model('Item', ItemSchema);
