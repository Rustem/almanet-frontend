/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var Fuse = require('../../../libs/fuse');
var React = require('react/addons');
var cx        = React.addons.classSet;
var Router = require('react-router');
var capitalize = require('../../../utils').capitalize;
var fuzzySearch = require('../../../utils').fuzzySearch;
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../../common/IconSvg.react');
var AppContextMixin = require('../../../mixins/AppContextMixin');
var ActivityStore = require('../../../stores/ActivityStore');
var Form = require('../../../forms/Form.react');
var inputs = require('../../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Input = inputs.Input;
var Div = require('../../../forms/Fieldset.react').Div;
var Crumb = require('../../common/BreadCrumb.react').Crumb;
var ActivityList = require('../ActivityList.react');

function get_activity_number(user) {
    return _.size(ActivityStore.myFeed(user));
}


var MyFeedLink = React.createClass({
    mixins: [Router.State, AppContextMixin],
    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return {'amount': get_activity_number(this.getUser())};
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({'amount': get_activity_number(this.getUser())});
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive()
        });
        return (
            <Link className={className} to='my_feed'>
                <div className="row-icon">
                    <IconSvg iconKey="timeline" />
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
        return route.name === 'my_feed';
    }
});


var FilterBar = React.createClass({
    propTypes: {
        value: React.PropTypes.object,
        onHandleUserInput: React.PropTypes.func
    },
    render: function() {
        return (
            <Form onUpdate={this.onHandleUpdate} value={this.props.value} name='activity:filter_activity_form' ref='filter_activity_form'>
                <div className="page-header-filterContainer">
                    <div className="page-header-filter row">
                        <div className="row-icon">
                            <IconSvg iconKey='search' />
                        </div>
                        <div className="row-body row-body--inverted">
                            <div className="row-body-secondary">
                                <IconSvg iconKey='arrow-down' />
                            </div>
                            <div className="row-body-primary">
                                <Input name="filter_text" type="text" className="input-filter" placeholder="Фильтр" />
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        )
    },
    onHandleUpdate: function(value) {
        var form = this.refs.filter_activity_form;
        var errors = form.validate();
        if(!errors) {
            this.props.onHandleUserInput(form.value());
        } else {
            alert(errors);
        }
    }

});

var MyFeedDetailView = React.createClass({
    mixins: [Router.Navigation, AppContextMixin],
    propTypes: {
        label: React.PropTypes.string
    },

    getInitialState: function() {
        activities = ActivityStore.myFeed(this.getUser());
        return {
            activities: activities,
            search_bar: {filter_text: ''}
        }
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
            activities = fuzzySearch(this.state.activities, value.filter_text, {
                'keys': ['description']});
        } else {
            activities = ActivityStore.myFeed(this.getUser());
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
});

module.exports.DetailView = MyFeedDetailView;
module.exports.Link = MyFeedLink;
