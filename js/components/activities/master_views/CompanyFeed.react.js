/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var cx        = React.addons.classSet;
var Router = require('react-router');
var capitalize = require('../../../utils').capitalize;
var fuzzySearch = require('../../../utils').fuzzySearch;
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../../common/IconSvg.react');
var ActivityStore = require('../../../stores/ActivityStore');
var AppContextMixin = require('../../../mixins/AppContextMixin');

function get_activity_number() {
    return _.size(ActivityStore.getByDate());
}


var CompanyFeedLink = React.createClass({
    mixins: [Router.State],
    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return {'amount': get_activity_number()};
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({'amount': get_activity_number()});
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive()
        });
        return (
            <Link className={className} to='company_feed'>
                <div className="row-icon">
                    <IconSvg iconKey="business-timeline" />
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
        var routes = this.getRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name === 'company_feed';
    }
});

var CompanyFeedDetailView = React.createClass({
    mixins: [Router.Navigation, AppContextMixin],
    propTypes: {
        label: React.PropTypes.string
    },
    
    render: function() {
        return (
            <div className="page page--noHeaderOpts">
                <div className="page-header">
                    <h1>CompanyFeed</h1>
                </div>
                <div className="page-body">
                    <h4>CompanyFeed</h4>
                </div>
            </div>
        )
    },
});

module.exports.DetailView = CompanyFeedDetailView;
module.exports.Link = CompanyFeedLink;
