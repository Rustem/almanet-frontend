/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var Router = require('react-router');
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var fuzzySearch = require('../../utils').fuzzySearch;
var AppContextMixin = require('../../mixins/AppContextMixin');
var ActivityStore = require('../../stores/ActivityStore');
var UserStore = require('../../stores/UserStore');
var BreadCrumb = require('../common/BreadCrumb.react');
var ActivityList = require('./ActivityList.react');
var CommentsList = require('./CommentsList.react');
var FilterBar = require('./ActivityFilterBar.react');

var ActivitySelectedView = React.createClass({
    mixins: [Router.State, AppContextMixin],

    getDefaultActivities: function() {
        var activities = null;
        var menu = this.getParams().menu;
        switch(menu) {
            case 'my_feed':
                activities = ActivityStore.myFeed(this.getUser());;
                break;
            case 'company_feed':
                activities = ActivityStore.getByDate(true);
                break;
        }
        return activities;
    },

    getInitialState: function() {
        var activities = this.getDefaultActivities();

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
            activities = this.getDefaultActivities();
        }

        var newState = React.addons.update(this.state, {
            activities: {$set: activities},
            search_bar: {$set: value},
        });
        this.setState(newState);
    },

    render: function() {
        return (<div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page page--noHeaderOpts">
                        <div className="page-header">
                            <BreadCrumb slice={[1, -1]} />
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
                </div>
                <div className="body-detail">
                    <CommentsList />
                </div>
            </div>
            <Footer />
          </div>)
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    }

});


module.exports = ActivitySelectedView;
