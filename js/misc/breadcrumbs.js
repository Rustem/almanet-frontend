var keyMirror = require('react/lib/keyMirror');
var BreadcrumbManager = require('breadcrumbmanager');
var EventEmitter = require('events').EventEmitter;

var EVENTS = keyMirror({
    PUSH: null,
    POP: null
});


BreadcrumbKeeper = assign({}, EventEmitter.prototype, {
    initialize: function() {
        this._manager = new BreadcrumbManager(7);
        this.addListener(EVENTS.PUSH, this.onPush);
        this.addListener(EVENTS.POP, this.onPop);
        return this;
    },
    addListener: function(evt, callback) {
        this.on(evt, callback);
    },
    onPush: function(crumb) {
        this._manager.add(crumb);
    },
    onPop: function() {
        this._manager.prev();
    },
    all: function() {
        return this._manager._breadcrumbs;
    },
    last: function() {
        return this._breadcrumbs[this._breadcrumbs.length];
    }
});

BCK = BreadcrumbKeeper.initialize()

var push = function(crumb) {
    this.emit(EVENTS.PUSH, crumb);
}.bind(BCK);

var pop = function() {
    this.emit(EVENTS.POP);
}.bind(BCK);

module.exports = BCK;
module.exports.push = push;
module.exports.pop = pop;
