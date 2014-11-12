/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var cx        = React.addons.classSet;
var Router = require('react-router');
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');
var ShareStore = require('../../stores/ShareStore');
var AppContextMixin = require('../../mixins/AppContextMixin');

var SharedContactLink = React.createClass({
    mixins: [AppContextMixin, ActiveState],

    statics: {
        getState: function() {
            return {
                'amount': ShareStore.size(),
                'hasNewItems': ShareStore.hasNew()
            }
        }
    },

    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return SharedContactLink.getState();
    },
    componentWillMount: function() {

    },
    componentWillUnmount: function() {
        ContactStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(SharedContactLink.getState());
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive(),
            'new': this.state.hasNewItems
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
                      {this.state.amount}
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

    getShares: function() {
        return this.state.shares;
    },

    getSharesNumber: function() {
        return this.getShares().length;
    },


    render: function() {
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
