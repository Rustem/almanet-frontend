var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var ActionSignalManager = assign({}, EventEmitter.prototype, {
    connect: function(action_type, callback) {
        this.on(action_type, callback);
    },
    send: function() {
        return this.emit.apply(this, arguments)
    }
});

module.exports = ActionSignalManager;
