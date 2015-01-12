/**
 * @jsx React.DOM
 */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var BreadCrumb = require('../common/BreadCrumb.react');
var IconSvg = require('../common/IconSvg.react');
var AppContextMixin = require('../../mixins/AppContextMixin');
var ActivityFilterBar = require('../activities/ActivityFilterBar.react');
var ActivityList = require('../activities/ActivityList.react');
var ActivityStore = require('../../stores/ActivityStore');
var UserStore = require('../../stores/UserStore');
var fuzzySearch = require('../../utils').fuzzySearch;

var ProfileInformation = React.createClass({
    

    render: function() {
        var user = this.props.user;
        return (
            <div className="body-master">
              <div className="page page--breadcrumbsHeader">
                <div className="page-header">
                  <BreadCrumb slice={[1, -1]} />
                </div>
                <div className="page-body">

                  <div className="userProfile">
                    <figure className="userProfile-pic">
                      <img src={"img/userpics/"+user.userpic} className="userProfile-pic-img" alt="" />
                    </figure>
                  </div>

                  <div className="contact">
                    <div className="inputLine">
                      <div className="row">
                        <div className="row-icon"></div>
                        <div className="row-body">
                          <div className="text-large text-strong">
                            Алтаев Санжар
                          </div>
                          <div className="inputLine-negativeTrail text-secondary">
                            CEO
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-vertical space-vertical--compact"></div>

                    <div className="inputLine inputLine--vcardRow">
                      <div className="row">
                        <div className="row-icon">
                        </div>
                        <div className="row-body">
                          <div className="inputLine-negativeTrail">
                            <div className="text-caption text-secondary">
                              mobile
                            </div>
                          </div>
                          <div className="inputLine-div">
                            +7 777 7777777
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-verticalBorder"></div>

                    <div className="inputLine inputLine--vcardRow">
                      <div className="row">
                        <div className="row-icon">
                        </div>
                        <div className="row-body">
                          <div className="inputLine-negativeTrail">
                            <div className="text-caption text-secondary">
                              work
                            </div>
                          </div>
                          <div className="inputLine-div">
                            info@companyname.com
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-vertical"></div>

                    <a href="#">
                      <strong className="text-large">Показать больше</strong>
                    </a>

                  </div><div className="contact-aside">
                    <a href="/contacts/details-edit" className="text-secondary">Редактировать</a>
                  </div>

                  <div className="space-verticalBorder"></div>

                  <ul className="userProfile-kpi">
                    <li className="userProfile-kpi-item">
                        <IconSvg iconKey="cart" />
                      Закрытых циклов: <strong className="userProfile-kpi-value">20 ($ 1000)</strong>
                    </li>
                    <li className="userProfile-kpi-item">
                        <IconSvg iconKey="clock" />
                      Открытых циклов на данный момент: <strong className="userProfile-kpi-value">3</strong>
                    </li>
                  </ul>


                </div>

              </div>
            </div>
        )
    }
});

var ProfileFeed = React.createClass({

    getInitialState: function() {
        activities = ActivityStore.profileFeed(this.props.user);
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
            activities = ActivityStore.profileFeed(this.props.user);
        }

        var newState = React.addons.update(this.state, {
            activities: {$set: activities},
            search_bar: {$set: value},
        });
        this.setState(newState);
    },

    render: function() {
        return (
            <div className="body-detail">
              <div className="page page--noHeaderOpts">
                <div className="page-header">
                  <BreadCrumb.Crumb />
                  <ActivityFilterBar
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
        )
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    }
});

var ProfileView = React.createClass({
    mixins: [AppContextMixin],

    render: function() {
        return (
            <div>
                <Header />
                <div>
                    <ProfileInformation user={this.getUser()} />
                    <ProfileFeed user={this.getUser()} />
                </div>
                <Footer />
            </div>
        )
    }
});

module.exports = ProfileView;
