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
        return route.name === 'shared' || (route.props.isDefault && route.props.path === '/');
    }
});

var SharedContactDetailView = React.createClass({
    propTypes: {
        label: React.PropTypes.string
    },

    render: function() {
        console.log(this.props);
        return (
        <div className="page">
            <div className="page-header">
                <ul className="page-breadcrumbs">
                  <li><span class="page-breadcrumbs-link">{this.props.alt}</span></li>
                </ul>
            </div>
            <div className="page-body">

            </div>
        </div>
        )
    }
});



module.exports.DetailView = SharedContactDetailView;
module.exports.Link = SharedContactLink;
