var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var RELATIONSHIPS = require('../router').relationships;
var NODES = require('../router').NODES;
var _stack = [];

function BreadcrumbDS() {
    this._locations = [];
    this._routes = [];
    this._map = {};
}

BreadcrumbDS.prototype.size = function() {
    return this._locations.length;
};

BreadcrumbDS.prototype.isEmpty = function() {
    return this.size() === 0;
};

BreadcrumbDS.prototype.pushAll = function(routes) {
    _.forEach(routes, function(route) { this.push(route) }.bind(this));
};

BreadcrumbDS.prototype.clear = function() {
    while(!this.isEmpty()) {
        this.pop();
    }
};

BreadcrumbDS.prototype.pop = function() {
    var path = this._locations.pop();
    var route = this._routes.pop();
    delete this._map[route];
};

BreadcrumbDS.prototype.peek = function(idx) {
    if(idx === undefined) {
        var routeName = this._routes[this.size() - 1];
    } else {
        var routeName = this._routes[idx];
    }
    var node = NODES[routeName];
    var state = this._map[routeName];
    var state = _.extend({}, {'node': node}, state);
    return state;
};

BreadcrumbDS.prototype.push = function(route) {
    this._locations.push(route.path);
    this._routes.push(route.name);
    this._map[route.name] = route;
}

BreadcrumbDS.prototype.update = function(routes, path) {
    // if no crumbs yet
    if(this.isEmpty()) {
        this.pushAll(routes);
        return true;
    }
    // if path is already in data structure
    var depth = this.find(path);
    var currentDepth = this.size();
    if(depth > -1) {
        while(currentDepth - depth - 1 > 0) {
            this.pop();
            currentDepth -= 1;
        }
        return true
    }
    // has common tail with length one route less that current
    if(routes.length - currentDepth === 1) {
        var route = routes[routes.length - 2];
        if(this.find(route.path) + 1 === currentDepth) {
            this.push(routes[routes.length - 1]);
            return true
        }
    }

    // // has common tail and siblings
    // if(routes.length - currentDepth === 0) {
    //     var route = routes[routes.length - 2];
    //     if(this.find(route.path) === currentDepth) {
    //         this.push(routes[routes.length - 1]);
    //         return true
    //     }
    // }

    var relatedDepth = this.hasRel(routes[routes.length - 1]);
    console.log('RELATIONSHIPS', relatedDepth);
    // if no logical relation
    if(relatedDepth === -1) {
        this.clear();
        this.pushAll(routes);
    } else {
        // pop until relatedDepth
        while(currentDepth - relatedDepth - 1 > 0) {
            this.pop();
            currentDepth -= 1;
        }
        // update
        for(var i = 0; i<routes.length; i++) {
            if(this.find(routes[i].path) > -1) {
                continue;
            }
            this.push(routes[i]);
        }
    }
    return true;
};

BreadcrumbDS.prototype.find = function(path) {
    var j = -1;
    for(var i = 0; i<this.size(); i++) {
        var curPath = this._locations[this.size() - i - 1];
        if(curPath === path) {
            j = this.size() - i - 1;
            break;
        }
    }
    return j;
};

BreadcrumbDS.prototype.hasRel = function(route) {
    if(!(route.name in RELATIONSHIPS)) {
        return -1;
    }
    var parentRoutes = RELATIONSHIPS[route.name];
    console.log(parentRoutes, this._routes);
    for(var i = 0; i < this.size(); i++) {
        var curRoute = this._routes[this.size() - i - 1];
        if(parentRoutes.indexOf(curRoute) > -1) {
            return this.size() - i - 1;
        }
    }
    return -1;
};

BreadcrumbDS.prototype.getHydrated = function() {
    var crumbs = [];
    for(var i = 0; i<this.size(); i++) {
        crumbs.push(this.peek(i));
    }
    return crumbs;
};

var _state = new BreadcrumbDS();


var BreadcrumbStore = assign({}, EventEmitter.prototype, {

    update: function(routes, path) {
        _state.update(routes, path);
        console.log(_state.getHydrated(), "hi");
    },
    get: function() {
        _state.getHydrated();
    },
});

module.exports = BreadcrumbStore;
