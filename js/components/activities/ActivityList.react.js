var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var AppContextMixin = require('../../mixins/AppContextMixin');
var ActivityStore = require('../../stores/ActivityStore');
var ContactStore = require('../../stores/ContactStore');
var SalesCycleStore = require('../../stores/SalesCycleStore');
var UserStore = require('../../stores/UserStore');
var utils = require('../../utils');
var Router = require('react-router');
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');

var URL_PREFIX  = require('../../constants/CRMConstants').URL_PREFIX;

var ActivityListItem = React.createClass({
    mixins: [Router.State, AppContextMixin],
    propTypes: {
        activity: React.PropTypes.object,
        onCommentLinkClick: React.PropTypes.func,
    },
    componentWillMount: function() {
        this.FEEDBACK_ICONS = utils.get_constants('activity').feedback_icons;
    },

    isItemSelected: function(act_id) {
        var id = this.getParams().id;
        if(id != undefined)
            if(id == act_id)
                return true;
        return false;
    },

    getRouteName: function() {
        var routes = this.getRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name;
    },

    getAuthor: function(user_id) {
        return UserStore.get(user_id);
    },

    getContact: function(a) {
        return ContactStore.byActivity(a);
    },

    getSalesCycle: function(a) {
        return SalesCycleStore.get(a.sales_cycle_id);
    },

    render: function() {
        var activity = this.props.activity;
        var author = this.getAuthor(activity.author_id);
        var contact = this.getContact(activity);
        var menu = this.getParams().menu || this.getRouteName();
        var classNames = cx({
            'stream-item': true,
            'active': this.isItemSelected(activity.id),
            'new': !activity.has_read,
        });
        return (
            <div className={classNames}>
                <div className="row">
                    <div className="row-icon">
                        <IconSvg iconKey={this.FEEDBACK_ICONS[activity.feedback_status]} />
                  </div>
                  <div className="row-body row-body--no-trailer">
                    <div className="row">
                      <a href="#" className="row-icon">
                        <figure className="icon-userpic">
                            <img src={URL_PREFIX + author.userpic} />
                        </figure>
                      </a>
                      <div className="row-body">
                        <div className="row">
                          <div className="row-body-primary text-caption text-secondary">
                            <a href="#" className="text-secondary">{author.vcard.fn}</a> в {utils.formatTime(activity)}
                          </div>
                          <div className="row-body-secondary">
                            <Link to='activity_selected'
                                  params={{menu: menu, id: activity.id}}
                                  className="stream-breadcrumbs">
                                  <IconSvg iconKey="comment" />
                            </Link>
                          </div>
                        </div>
                        <div className="row-body-message">
                            {activity.description}
                        </div>
                        <ul className="stream-breadcrumbs">
                            <li>
                                <Link to='contact_profile' 
                                      params={{id: contact.id}} 
                                      className="stream-breadcrumbs">
                                      {contact.vcard.fn}
                                </Link>
                            </li>
                            <li>→</li>
                            <li>
                                <Link to='activities_by' 
                                      params={{id: contact.id, sales_cycle_id: this.getSalesCycle(activity).id}} 
                                      className="stream-breadcrumbs">
                                      {this.getSalesCycle(activity).title}
                                </Link>
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
        activities: React.PropTypes.array,
        onCommentLinkClick: React.PropTypes.func,
    },

    render: function() {
        var activityListItems = this.props.activities.map(function(activity) {
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

module.exports = ActivityList;
