/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
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
        this.filter(routes, {ignore_defaults: true}).forEach(function(route, i, arr) {
            var name = route.alt ? route.alt : route.props.handler.displayName;
            var link = name;
            var link_props = {
                to: route.name,
                params: route.params,
                query: route.query
            }
            if(i !== arr.length - 1) {
                link = <Link {...link_props} className="page-breadcrumbs-link">{name}</Link>;
            } else {
                link = <Link {...link_props} className="page-breadcrumbs-link active">{name}</Link>;
            }
            crumbs.push(
                <li key={route.path + '' + crumbs.length}>
                    {link}
                </li>
            );
        });
        return <ul className="page-breadcrumbs">{crumbs}</ul>;
    }
});

module.exports = BreadCrumb;
