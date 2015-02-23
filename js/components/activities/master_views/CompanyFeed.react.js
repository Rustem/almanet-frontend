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
var UserStore = require('../../../stores/UserStore');
var AppContextMixin = require('../../../mixins/AppContextMixin');
var FilterBar = require('../ActivityFilterBar.react');
var Crumb = require('../../common/BreadCrumb.react').Crumb;
var ActivityList = require('../ActivityList.react');
var ActivityActionCreators = require('../../../actions/ActivityActionCreators');

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
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({'amount': get_activity_number()});
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive(),
            'new': ActivityStore.hasNew(),
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

    statics: {
        willTransitionFrom: function (transition, component) {
            var ids = _.map(_.filter(component.state.activities, function(a) {
                    return !a.has_read;
                }), function(a){ return a.id });
            if(ids.length > 0)
                ActivityActionCreators.mark_as_read(ids);
        }
    },

    propTypes: {
        label: React.PropTypes.string
    },

    getInitialState: function() {
        activities = ActivityStore.getByDate();
        return {
            activities: activities,
            search_bar: {filter_text: ''}
        }
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    getFilterText: function() {
        return this.state.search_bar.filter_text;
    },

    getActivities: function() {
        return this.state.activities;
    },

    onFilterBarUpdate: function(value) {
        var activities = null;
        if(value.filter_text) {
            activities = fuzzySearch(this.getActivities(), value.filter_text, {
                'keys': ['description']});
        } else {
            activities = ActivityStore.getByDate();
        }

        var newState = React.addons.update(this.state, {
            activities: {$set: activities},
            search_bar: {$set: value},
        });
        this.setState(newState);
    },
    
    render: function() {
        return (
            <div className="page page--noHeaderOpts">
                <div className="page-header">
                    <Crumb />
                    <FilterBar
                        ref="filter_bar"
                        value={this.state.search_bar}
                        onHandleUserInput={this.onFilterBarUpdate} />
                </div>
                <ActivityList
                    ref="activity_list"
                    filter_text={this.getFilterText()}
                    activities={this.getActivities()} />
            </div>
        )
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    }
});

module.exports.DetailView = CompanyFeedDetailView;
module.exports.Link = CompanyFeedLink;
