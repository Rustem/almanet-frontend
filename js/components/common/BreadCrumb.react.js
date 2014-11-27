/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var cx            = React.addons.classSet;
var Router = require('react-router');
var Link = Router.Link;
var BreadCrumbStore = require('../../stores/BreadcrumbStore');



var BreadCrumb = React.createClass({

    propTypes: function() {
        slice: React.PropTypes.array
    },

    getRoutes: function() {
        return BreadCrumbStore.get()
    },

    filter: function(routes, options) {
        // corner case
        if(routes.length <= 2) {
            return routes;
        }
        var ignore_defaults = false;
        var rv = [];
        if(options !== undefined) {
            ignore_defaults = options['ignore_defaults'];
        }
        slice = this.props.slice || null;
        if(!slice) {
            rv = routes;
        }
        else if(slice.length == 2) {
            rv = routes.slice(slice[0], slice[1]);
        }
        else if(slice.length == 1) {
            rv = routes.slice(slice[0]);
        }
        if(ignore_defaults) {
            return _.filter(rv, function(route) {
                return route.name.indexOf('default') === -1;
            })
        }
        return rv;

    },

    render: function() {
        var crumbs = [];
        var routes = this.getRoutes();
        console.log('ROUTES', routes);
        this.filter(routes, {ignore_defaults: true}).forEach(function(route, i, arr) {
            var name = route.alt ? route.alt : route.props.handler.displayName;
            var link = name;
            var link_props = _.extend({}, {
                to: route.name,
                params: route.params,
                query: route.query
            });
            var className = cx({
                'page-breadcrumbs-link': true,
                'active': i === arr.length - 1
            });
            crumbs.push(
                <li key={route.path + '' + crumbs.length}>
                    <Link {...link_props} className={className} activeClassName="react-router-active">{name}</Link>
                </li>
            );
        });
        return <ul className="page-breadcrumbs">{crumbs}</ul>;
    }
});

var Crumb = React.createClass({
    current: function() {
        return BreadCrumbStore.getCurrent()
    },
    render: function() {
        var route = this.current();
        return (
            <ul className="page-breadcrumbs">
                <li><span className="page-breadcrumbs-link">{route.alt}</span></li>
            </ul>
        );
    }
});

module.exports = BreadCrumb;
module.exports.Crumb = Crumb;
