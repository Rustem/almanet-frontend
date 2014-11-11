/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var React = require('react');
var cx        = React.addons.classSet;
var Router = require('react-router');
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');
var MasterDetailBreadCrumbs = require('../common/BreadCrumb.react').MasterDetailBreadCrumbs;

var ColdBaseLink = React.createClass({
    mixins: [Router.ActiveState],
    propTypes: {
        label: React.PropTypes.string,
    },
    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive()
        });
        return (
            <Link className={className} to='coldbase'>
                <div className="row-icon"></div>
                <div className="row-body">
                    <div className="row-body-primary">
                        {this.props.label}
                    </div>
                    <div className="row-body-secondary">
                      xx
                    </div>
                </div>
            </Link>
        )
    },
    isCurrentlyActive: function() {
        var routes = this.getActiveRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name === 'shared';
    }
});

var ColdBaseDetailView = React.createClass({
    propTypes: {
        label: React.PropTypes.string
    },

    render: function() {
        return (
        <div className="page">
            <div className="page-header">
                <MasterDetailBreadCrumbs isMaster={false} />
            </div>
            <div className="page-body">

            </div>
        </div>
        )
    }
});

module.exports.DetailView = ColdBaseDetailView;
module.exports.Link = ColdBaseLink;
