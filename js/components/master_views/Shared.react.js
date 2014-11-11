/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var React = require('react');
var cx        = React.addons.classSet;
var Router = require('react-router');
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');
var MasterDetailBreadCrumbs = require('../common/BreadCrumb.react').MasterDetailBreadCrumbs;


var SharedContactLink = React.createClass({
    mixins: [ActiveState],
    propTypes: {
        label: React.PropTypes.string,
        isNew: React.PropTypes.bool   // when new contact created or somebody shared in realtime
    },
    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive(),
            'new': this.props.isNew
        });
        return (
            <Link className={className} to='shared'>
                <div className="row-icon">
                    <IconSvg iconKey="inbox" />
                </div>
                <div className="row-body">
                    <div className="row-body-primary">
                        {this.props.label}
                    </div>
                    <div className="row-body-secondary">
                      4
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

var SharedContactDetailView = React.createClass({
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



module.exports.DetailView = SharedContactDetailView;
module.exports.Link = SharedContactLink;
