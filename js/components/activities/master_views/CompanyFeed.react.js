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
var ContactStore = require('../../../stores/ContactStore');
var SalesCycleStore = require('../../../stores/SalesCycleStore');
var UserStore = require('../../../stores/UserStore');
var AppContextMixin = require('../../../mixins/AppContextMixin');
var Form = require('../../../forms/Form.react');
var inputs = require('../../../forms/input');
var Input = inputs.Input;
var Crumb = require('../../common/BreadCrumb.react').Crumb;

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

var ActivityListItem = React.createClass({
    mixins: [AppContextMixin],
    propTypes: {
        activity: React.PropTypes.object,
    },

    getAuthor: function(user_id) {
        return UserStore.get(user_id);
    },

    getContact: function(sc_id) {
        return ContactStore.get(SalesCycleStore.get(sc_id).contact_id);
    },

    render: function() {
        var activity = this.props.activity;
        var author = this.getAuthor(activity.author_id);
        var contact = this.getContact(activity.salescycle_id);
        return (
            <div className="stream-item">
                <div className="row">
                    <div className="row-icon">
                        <IconSvg iconKey={activity.feedback} />
                  </div>
                  <div className="row-body row-body--no-trailer">
                    <div className="row">
                      <a href="#" className="row-icon">
                        <figure className="icon-userpic">
                            <img src={"img/userpics/" + author.userpic} />
                        </figure>
                      </a>
                      <div className="row-body">
                        <div className="row">
                          <div className="row-body-primary text-caption text-secondary">
                            <a href="#" className="text-secondary">{author.first_name} {author.last_name}</a> в {activity.at}
                          </div>
                          <div className="row-body-secondary">
                            <a href="#" className="row-icon">
                                <IconSvg iconKey="comment" />
                            </a>
                          </div>
                        </div>
                        <div className="row-body-message">
                            {activity.description}
                        </div>
                        <ul className="stream-breadcrumbs">
                            <li>
                                <Link to='contact_profile' params={{id: contact.id}} className="stream-breadcrumbs">{contact.fn}</Link>
                            </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        )
    }
});

var ActivityList = React.createClass({
    propTypes: {
        filter_text: React.PropTypes.string,
        activities: React.PropTypes.array,
        selection_map: React.PropTypes.object,
        onChangeState: React.PropTypes.func
    },

    render: function() {
        var activityListItems = activities.map(function(activity) {
            return(
                <ActivityListItem
                    activity={activity} />
            )
        }.bind(this));

        return (
            <div className="page-body">
                {activityListItems}
            </div>
        )
    }
});

var CompanyFeedDetailView = React.createClass({
    mixins: [Router.Navigation, AppContextMixin],
    propTypes: {
        label: React.PropTypes.string
    },

    getInitialState: function() {
        activities = ActivityStore.getByDate(true);
        return {
            activities: activities,
            search_bar: {select_all: false, filter_text: ''}
        }
    },

    getFilterText: function() {
        return this.state.search_bar.filter_text;
    },

    getActivities: function() {
        return this.state.activities;
    },

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            activities = null;
        if(value.filter_text) {
            activities = fuzzySearch(this.state.activities, value.filter_text, {
                'keys': ['description']});
        } else {
            activities = ActivityStore.getByDate(true);
        }
        for(var activity_id in this.state.selection_map) {
            _map[activity_id] = false;
        }
        for(var i = 0; i<activities.length; i++) {
            activity_id = activities[i].id;
            if(changed) {
                _map[activity_id] = value.select_all;
            } else if(value.select_all) {
                _map[activity_id] = true;
            } else {
                _map[activity_id] = this.state.selection_map[activity_id];
            }
        }

        var newState = React.addons.update(this.state, {
            activities: {$set: activities},
            selection_map: {$set: _map},
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

module.exports.DetailView = CompanyFeedDetailView;
module.exports.Link = CompanyFeedLink;
