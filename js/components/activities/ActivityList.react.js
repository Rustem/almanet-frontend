var React = require('react/addons');
var AppContextMixin = require('../../mixins/AppContextMixin');
var ActivityStore = require('../../stores/ActivityStore');
var ContactStore = require('../../stores/ContactStore');
var UserStore = require('../../stores/UserStore');
var Router = require('react-router');
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');

var ActivityListItem = React.createClass({
    mixins: [AppContextMixin],
    propTypes: {
        activity: React.PropTypes.object,
    },

    getAuthor: function(user_id) {
        return UserStore.get(user_id);
    },

    getContact: function(a) {
        return ContactStore.byActivity(a);
    },

    render: function() {
        var activity = this.props.activity;
        var author = this.getAuthor(activity.author_id);
        var contact = this.getContact(activity);
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

module.exports = ActivityList;