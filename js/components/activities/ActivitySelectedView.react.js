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
var CommentStore = require('../../stores/CommentStore');
var CommentWebAPI = require('../../api/CommentWebAPI');
var BreadCrumb = require('../common/BreadCrumb.react');
var Crumb = BreadCrumb.Crumb;
var ActivityList = require('./ActivityList.react');
var CommentList = require('./CommentList.react');
var FilterBar = require('./ActivityFilterBar.react');
var CommentComposer = require('./CommentComposer.react');
var CommentActionCreators = require('../../actions/CommentActionCreators');

var ActivitySelectedView = React.createClass({
    mixins: [Router.State, AppContextMixin],
    statics: {
        fetchData: function(params) {
            return CommentActionCreators.loadByActivityID(params.id);
        }
    },

    getInitialState: function() {
        var activities = this.getDefaultActivities(),
            comments = CommentStore.getByActivityID(this.getActivityID());

        return {
            activities: activities,
            comments: comments,
            search_bar: {filter_text: ''}
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this._onChange();
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
        CommentStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
        CommentStore.removeChangeListener(this._onChange);
    },

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

    getActivityID: function() {
        return this.getParams().id;
    },

    getFilterText: function() {
        return this.state.search_bar.filter_text;
    },

    getActivities: function() {
        return this.state.activities;
    },

    getComments: function() {
        return this.state.comments;
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

    onCommentCreate: function(commentObject) {
      CommentActionCreators.create(commentObject);
      return;
    },

    onReply: function(recipient) {
        this.refs.commentComposer.forceIsCommenting(recipient);
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
                    <div className="page page--compact">
                        <div className="page-header">
                            <Crumb />
                        </div>
                        <div className="page-body">
                            <CommentList comments={this.getComments()}
                                         onReply={this.onReply} />
                            <CommentComposer ref="commentComposer"
                                             onHandleSubmit={this.onCommentCreate}
                                             activity_id={this.getActivityID()} />
                        </div>
                    </div>
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
