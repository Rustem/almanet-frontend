/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var BreadCrumb = React.createClass({
    mixins: [Router.ActiveState],

    render: function() {
        var crumbs = [];
        var routes = this.getActiveRoutes().filter(function(r){
            return !r.props.isDefault;  // because default are always active
        });
        routes.forEach(function(route, i, arr) {
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

MasterDetailBreadCrumbs = React.createClass({
    mixins: [Router.ActiveState],

    propTypes: {
        isMaster: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            isMaster: true
        }
    },

    render: function() {
        var routes = this.getRoutes(this.props.isMaster);
        return this.renderRoutes(routes);
    },

    renderRoutes: function(routes) {
        console.log(routes);
        var crumbs = [];
        var isMaster = this.props.isMaster;
        routes.forEach(function(route, i, arr) {
            var name = route.props.alt ? route.props.alt : route.props.handler.displayName;
            var link = name;
            if(i != arr.length - 1 || isMaster === false) {
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
    },

    getRoutes: function(isMaster) {
        var routes = this.getActiveRoutes().filter(function(r){
            return !r.props.isDefault;  // because default are always active
        });
        return isMaster ? routes.slice(0, routes.length - 1) : routes.slice(-1);
    }


});

module.exports = BreadCrumb;
module.exports.MasterDetailBreadCrumbs = MasterDetailBreadCrumbs;
