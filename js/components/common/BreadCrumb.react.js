/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var BreadCrumb = React.createClass({
    mixins: [Router.ActiveState],

    propTypes: function() {
        slice: React.PropTypes.array
    },

    filter: function(routes) {
        slice = this.props.slice || null;
        if(!slice) {
            return routes;
        }
        if(slice.length == 2) {
            return routes.slice(slice[0], slice[1]);
        }
        if(slice.length == 1) {
            return routes.slice(slice[0]);
        }

    },

    render: function() {
        var crumbs = [];
        var routes = this.getActiveRoutes().filter(function(r){
            return !r.props.isDefault;  // because default are always active
        });
        this.filter(routes).forEach(function(route, i, arr) {
            var name = route.props.alt ? route.props.alt : route.props.handler.displayName;
            var link = name;
            if(i != arr.length - 1) {
                link = <Link className="page-breadcrumbs-link" to={route.props.path}>{name}</Link>;
            } else {
                link = <Link className="page-breadcrumbs-link active" to={route.props.path}>{name}</Link>;
            }
            crumbs.push(
                <li key={route.props.path + '' + crumbs.length}>
                    {link}
                </li>
            );
        });
        return <ul className="page-breadcrumbs">{crumbs}</ul>;
    }
});



module.exports = BreadCrumb;
