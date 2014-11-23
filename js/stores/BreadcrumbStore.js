var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var _stack = [];

function BreadcrumbDS(nodes, relationships) {
    this._locations = [];
    this._routes = [];
    this._map = {};
    this.NODES = nodes;
    this.RELATIONSHIPS = relationships;
}

BreadcrumbDS.prototype.size = function() {
    return this._locations.length;
};

BreadcrumbDS.prototype.isEmpty = function() {
    return this.size() === 0;
};

BreadcrumbDS.prototype.pushAll = function(routes, params, query) {
    _.forEach(routes, function(route) {
        this.push(route, params, query)
    }.bind(this));
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
    var node = this.NODES[routeName];
    var state = this._map[routeName];
    var state = _.extend({}, {'alt': node.getName()}, state);
    return state;
};

BreadcrumbDS.prototype.push = function(route, params, query) {
    this._locations.push(route.path);
    this._routes.push(route.name);

    var extractParams = function(paramNames) {
        var _params = {};
        _.forEach(route.paramNames, function(param) {
            _params[param] = params[param];
        });
        return _params;
    }.bind(this);
    this._map[route.name] = {
        name: route.name,
        handler: route.handler,
        params: extractParams(route.paramNames),
        query: query || {}
    };
}

BreadcrumbDS.prototype.update = function(routes, params, query) {
    // if no crumbs yet
    if(this.isEmpty()) {
        this.pushAll(routes, params, query);
        return true;
    }
    // if path is already in data structure then remove head
    var depth = this.find(routes[routes.length - 1].name);
    var currentDepth = this.size();
    if(depth > -1) {
        while(currentDepth - depth - 1 > 0) {
            this.pop();
            currentDepth -= 1;
        }
        return true
    }
    // has common tail with length one route less that current then simply add head to tail
    if(routes.length - currentDepth === 1) {
        var route = routes[routes.length - 2];
        if(this.find(route.name) + 1 === currentDepth) {
            this.push(routes[routes.length - 1], params, query);
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
        this.pushAll(routes, params, query);
    } else {
        // pop until relatedDepth
        while(currentDepth - relatedDepth - 1 > 0) {
            this.pop();
            currentDepth -= 1;
        }
        // update
        for(var i = 0; i<routes.length; i++) {
            if(this.find(routes[i].name) > -1) {
                continue;
            }
            this.push(routes[i], params, query);
        }
    }
    return true;
};

BreadcrumbDS.prototype.find = function(targetRouteName) {
    var j = -1;
    for(var i = 0; i<this.size(); i++) {
        var routeName = this._routes[this.size() - i - 1];
        if(routeName === targetRouteName) {
            j = this.size() - i - 1;
            break;
        }
    }
    return j;
};

BreadcrumbDS.prototype.hasRel = function(route) {
    if(!(route.name in this.RELATIONSHIPS)) {
        return -1;
    }
    var parentRoutes = this.RELATIONSHIPS[route.name];
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



var BreadcrumbStore = assign({}, EventEmitter.prototype, {
    initialize: function(nodes, relationships) {
        this._state = new BreadcrumbDS(nodes, relationships);
    },
    update: function(routes, path) {
        this._state.update(routes, path);
        console.log(this._state.getHydrated(), "hi");
    },
    get: function() {
        return this._state.getHydrated();
    },
    getCurrent: function() {
        return this._state.peek();
    }
});

module.exports = BreadcrumbStore;
