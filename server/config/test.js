'use strict';

import mongoose from 'mongoose';
import config from './environment';
import _ from 'lodash';
import fs from 'fs';
import request from 'request';
import * as drom from '../drom/drom.service';
import Item from '../api/item/item.model';
import User from '../api/user/user.model';
import async from 'async';
import jsdom from 'jsdom';
	
//mongoose.set('debug', true);
mongoose.connect(config.mongo.uri, config.mongo.options);

var theme = 1151343041,
    users = [
{dromId:229157, name: 'Вольдемар Иркутянский'},
{dromId:132677, name: 'mrsad'},
{dromId:212893, name: 'Султ@ныч'},
{dromId:92753, name: 'ВВС-иркутск'},
{dromId:411910, name: 'Игореня87'},
{dromId:171596, name: 'axiS_D'},
{dromId:155330, name: 'Crismen'},
{dromId:141845, name: 'Kornet138'},
{dromId:175504, name: 'Diesel_Power'},
{dromId:193171, name: '10 сектор'},
{dromId:288602, name: 'Алексей Лексус'},
{dromId:145909, name: 'IIIaMaH'},
{dromId:168964, name: 'Martym'},
{dromId:653767, name: 'Елена477'},
{dromId:360689, name: 'DeN4iK_irk'},
{dromId:331605, name: 'Язвочк@'},
{dromId:61969, name: 'Иван Иванович'},
{dromId:100209, name: 'Polusid'},
{dromId:359205, name: 'geograf91'},
{dromId:211501, name: 'ElenaShel'},
{dromId:371321, name: 'Tamahawk87'},
{dromId:334213, name: 'TashyPeek'},
{dromId:39300, name: 'Спартанец'},
{dromId:268595, name: 'Floyd'},
{dromId:60733, name: 'DrSergeich'},
{dromId:356376, name: 'Elly_Key'},
{dromId:193262, name: 'Bestia'},
{dromId:221426, name: 'fara.ON'},
{dromId:383665, name: '-Bert-'},
{dromId:89141, name: 'in_dex'},
{dromId:97347, name: 'Женя777'},
{dromId:71289, name: 'Comanche'},
{dromId:89703, name: 'mishalkin'},
{dromId:75561, name: 'Dinamit1'},
{dromId:461855, name: 'vancliff'},
{dromId:556547, name: 'D_i_m_k_a'},
{dromId:318198, name: 'Шуцка_крашена'},
{dromId:126639, name: 'Accord SIR-T'},
{dromId:108275, name: 'shaft15'},
{dromId:67322, name: 'Хондо-Вод'},
{dromId:113496, name: 'vasss'},
{dromId:207701, name: 'roboroma'},
{dromId:178223, name: 'VetK@'},
{dromId:438166, name: 'Владимир 111 38'},
{dromId:438318, name: 'Нулевой Холод'},
{dromId:109552, name: 'A_ST'},
{dromId:358172, name: 'DIMONiT'},
{dromId:368971, name: 'Nava'},
{dromId:265294, name: 'Y15'},
{dromId:98417, name: 'alexjfk'},
{dromId:157315, name: 'demetrius'},
{dromId:395997, name: 'Бред Пить'},
{dromId:2530, name: 'ford'},
{dromId:721066, name: 'Dr.Xa'},
{dromId:99454, name: 'A-Z'},
{dromId:57048, name: 'Lexus38'},
{dromId:86188, name: 'ALEX 22'},
{dromId:48516, name: 'TankA'},
{dromId:281690, name: 'Sendi_Chiks'},
{dromId:115693, name: 'Mortum'},
{dromId:692557, name: 'ШтормИрк'},
{dromId:469736, name: 'hypeR!'},
{dromId:182333, name: 'ХЕМУЛЬ'},
{dromId:153822, name: 'willow'},
{dromId:538596, name: '$@lex$'},
{dromId:619364, name: '-ivv-'},
{dromId:93136, name: 's-alex-s'},
{dromId:158842, name: '{dromId:UnFear] }I{u}I{a'},
{dromId:54301, name: 'siBEERian'},
{dromId:106404, name: 'Daimon_38'},
{dromId:325436, name: 'HeadShock'},
{dromId:102773, name: 'Пыца'},
{dromId:216253, name: '!Царь!'},
{dromId:207845, name: 'Санёк11'},
{dromId:426246, name: 'wolvers'},
{dromId:89987, name: 'Dimasy678'},
{dromId:185299, name: 'Tray'},
{dromId:112496, name: 'GROM_IRK'},
{dromId:365631, name: 'Инспектор Козлов'},
{dromId:301396, name: 'Iriska'},
{dromId:284442, name: 'EjonikS'},
{dromId:249582, name: 'MegaGarik'},
{dromId:232192, name: 'Iliich'},
{dromId:300436, name: 'NVK'},
{dromId:263517, name: 'Dex138'},
{dromId:165757, name: 'Wellcom'},
{dromId:305246, name: 'Banderas38rus'},
{dromId:10203, name: 'брат2'},
{dromId:75372, name: 'sulik'},
{dromId:289525, name: 'Nikolaevna'},
{dromId:76290, name: '_Grek_'},
{dromId:68639, name: 'kresman'},
{dromId:301794, name: 'Игорь_Иркутск'},
{dromId:152668, name: 'primorka'},
{dromId:354049, name: 'King.38'},
{dromId:618562, name: 'Martyk'},
{dromId:118490, name: 'Alex_IRK'},
{dromId:606107, name: 'PArtAl'},
{dromId:220255, name: 'MPW'},
{dromId:279692, name: 'GeoIrk'},
{dromId:219933, name: '-IRKUT-'},
{dromId:221732, name: 'SEREBRO60'},
{dromId:212023, name: 'sarkazi'},
{dromId:139700, name: 'podrez2008'},
{dromId:191048, name: '®iki'},
{dromId:74374, name: 'evgen38'},
{dromId:455589, name: 'Шишечка'},
{dromId:478146, name: 'MelnikSA'},
{dromId:331207, name: '$tudeNT'},
{dromId:333420, name: 'kyubi'},
{dromId:123325, name: 'УдаFF'},
{dromId:469834, name: 'lifecredo'},
{dromId:407530, name: 'Leanka'},
{dromId:400065, name: 'Aerodrom676'},
{dromId:24460, name: 'Порнов'},
{dromId:110649, name: 'ChiM'},
{dromId:89188, name: 'm0id0dir'},
{dromId:257672, name: 'Жека PHIL'},
{dromId:186729, name: 'Стас К.'},
{dromId:193015, name: 'Чипуля'},
{dromId:355648, name: 'Troy38'},
{dromId:504893, name: 'ARISTOтель'},
{dromId:305066, name: 'Boyko38rus'},
{dromId:416352, name: 'Пчелка Майя'},
{dromId:469168, name: 'Fabvier'},
{dromId:103360, name: 'Aleksey_As'},
{dromId:134515, name: 'Аудит'},
{dromId:161137, name: '_КоТиГрРрРр_'},
{dromId:159630, name: 'Dлинный'},
{dromId:309569, name: 'смит ной'},
{dromId:59554, name: 'Lukasirkut'},
{dromId:84897, name: 'Shursh'},
{dromId:298016, name: 'Железнодорожник'},
{dromId:412530, name: 'Dnksn'},
{dromId:208028, name: 'kaspermp'},
{dromId:142194, name: 'ash404'},
{dromId:434133, name: '_RON_'},
{dromId:126291, name: 'Старая Гвардия'},
{dromId:12584, name: 'diz234'},
{dromId:284240, name: 'Khan_Zogen'},
{dromId:187438, name: 'DomiNik'},
{dromId:6503, name: 'yuden'},
{dromId:360240, name: 'Ya444'},
{dromId:351432, name: 'Магнификус'},
{dromId:68981, name: '[UnFear] TARANTULA'},
{dromId:64265, name: 'Tikka'},
{dromId:10573, name: 'GeorgeU'},
{dromId:90654, name: 'FlaFFy'},
{dromId:339721, name: 'Never mind'},
{dromId:347178, name: 'Jimmmi'},
{dromId:311405, name: 'N-Stein'},
{dromId:421931, name: 'Ellin'},
{dromId:376884, name: 'Shuric'},
{dromId:447367, name: 'Yurii757'},
{dromId:407379, name: 'Маньячелло'},
{dromId:55751, name: 'Allirk'},
{dromId:101343, name: 'MindFreedom'},
{dromId:86271, name: 'Блейн'},
{dromId:277487, name: 'тема421'},
{dromId:101746, name: 'SerGioo'},
{dromId:303662, name: 'штур-ман'},
{dromId:295719, name: 'Flying Lion'},
{dromId:235147, name: 'mailpiv'},
{dromId:293832, name: 'Burat'},
{dromId:88912, name: 'BIRBAR'},
{dromId:161038, name: 'Kris-Ka'},
{dromId:7854, name: '38rus'},
{dromId:259747, name: 'Пухлый'},
{dromId:108193, name: 'ОБХСС'},
{dromId:55481, name: 'petr83.irk'},
{dromId:100211, name: 'iStage'},
{dromId:132410, name: 'Drive_NSK'},
{dromId:276815, name: 'Kioto'},
{dromId:93835, name: 's_adios'},
{dromId:211933, name: 'papa_panda'},
{dromId:107998, name: 'нфтгзлмз'},
{dromId:87127, name: 'Fantomer'},
{dromId:125466, name: 'zx-80'},
{dromId:129417, name: 'M.Dogg'},
{dromId:91691, name: 'АВ-К'},
{dromId:108811, name: 'Санёк (Осколки Лета)'},
{dromId:201079, name: 'Baranov.doc'},
{dromId:273699, name: 'PsychoTech'},
{dromId:97580, name: 'Art_Odyssey'},
{dromId:45668, name: 'John J.'},
{dromId:414539, name: 'Sw011en2'},
{dromId:165262, name: 'Ayan'},
{dromId:312668, name: 'Царь38'},
{dromId:387095, name: 'PVL38'},
{dromId:234512, name: 'Дмитрий_701'},
{dromId:297321, name: 'Vlad 85'},
{dromId:79704, name: 'monah'},
{dromId:144037, name: 'vanekrus'},
{dromId:230824, name: 'OrLove'},
{dromId:24670, name: 'Sergey_Lav'},
{dromId:299152, name: 'Smile-38'},
{dromId:74997, name: 'shalam'},
{dromId:307979, name: 'фрикадельки'},
{dromId:94320, name: 'SmivaL'},
{dromId:190543, name: 'Ола'},
{dromId:237384, name: 'Амаранта13'},
{dromId:189303, name: 'polino'},
{dromId:70835, name: 'JMax_86'},
{dromId:300047, name: 'Солнце Пустыни'},
{dromId:119974, name: 'javani'},
{dromId:38721, name: 'Harold'},
{dromId:98970, name: 'Мудрый Лис'},
{dromId:145726, name: 'irish_cream'},
{dromId:111417, name: 'Zlango'},
{dromId:108344, name: 'Shua'},
{dromId:91587, name: 'dDen_'}
];


users.forEach(tmp => {

  User.findOne({name: tmp.name})
    .exec()
    .then(user => {
      if( ! user){
        return;
      }

      if(user.dromId > 0){
        return;
      }

      console.info("set dromId [%d] %s", tmp.dromId, tmp.name);
      user.dromId = tmp.dromId;
      user.save(function(err){
        console.log(err);
      });
    });
});

/*


async.compose.apply(this, (function(users){
  
  // last method will be called
  var maps = [function(next){
    next();
  }];

  // each call
  users.forEach(function(tmp){
    // add method to call
    maps.push(function(next){


      User.findOne({dromId: tmp.dromId})
        .exec()
        .then(user => {
          if(user){
            console.info("User exists [%d]: %s ", tmp.dromId, tmp.name);
            return next();
          }

          console.info("Create user [%d]: %s ", tmp.dromId, tmp.name);
          var user = new User({
            provider: 'invite',
            name: tmp.name,
            invite: {
              code: 0
            }
          });

          user.invite.code = user.makeHash();

          console.info("Save user");
          user.saveAsync()
            .spread(() => {
              console.info("Login in drom...");
              drom.login()
                .then(() => {
                  
                  console.info("Sending message");
                  return drom.sendMessage(
                    tmp.dromId, 
                    "Приглашение в игру \"Выстрел в стикер\"", 
                    'Привет! Я DromStickerBot, программа, которая будет автоматически считать "выстрелы" и "мины" в Дром-забаве "Выстрел в стикер". ' + 
                    'Я отправил Вам это письмо, потому что заметил Вашу активность в [URL=\"http://forums.drom.ru/irkutsk/t' + config.drom.theme + '.html\"]ветке[/URL]. ' + 
                    'Прошу вас подтвердить своё участие и дать согласие моему администратору внести Вас в список активных игроков. ' + 
                    'Если вы вышли из игры, прошу прощения за беспокойство, а так же, уведомить об этом администратора.' + 
                    "\n\n\n[URL=\"https://drom-sticker.herokuapp.com/invite?code=" + user.invite.code + "\"]Вступить в ряды[/URL]"
                  ).then(nikname => {
                    console.info("Message was sent!");
                    user.dromId = tmp.dromId;
                    user.saveAsync();
                    next();
                  }).catch(err => {
                    console.error(err);
                    next();
                  });
                })
                .catch(err => {
                  console.error(err);
                  next();
                });
            })
            .then(undefined, err => {
              console.error(err);
              next();
            });
        })
        .then(undefined, err => {
          console.error(err);
          next();
        })
    });
  });
  
  // return functions
  return maps;
})(users))(function (err) {
  if(err){ 
    console.error(err); 
    process.exit(1);
    return;
  }
  
  process.exit(0);
});
*/


/*
function getDocument(html)
{
  return new Promise((resolve, reject) => {

    var start = html.indexOf('<body');
    if(start === -1){
      return reject(new Error('Body not found'));
    }

    var end = html.indexOf('</body>');
    if(end === -1){
      return reject(new Error('Body not found'));
    }

    html = html.substr(start, end - start + 7);
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    jsdom.env({
      html: html, 
      scripts: ["http://code.jquery.com/jquery.js"], 
      done: function(err, window){
        if(err){ return reject(err); }
        resolve(window.$);
      }
    });
  });
}
*/

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