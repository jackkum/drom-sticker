/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var UserEvents = require('./user.events');

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('user:' + event, socket);

    UserEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, socket) {
  return function(doc) {

    delete doc.salt;
    delete doc.password;
    delete doc.invite;

    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    UserEvents.removeListener(event, listener);
  };
}
