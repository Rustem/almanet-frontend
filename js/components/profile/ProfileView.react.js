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
var SalesCycleStore = require('../../stores/SalesCycleStore');
var UserStore = require('../../stores/UserStore');
var fuzzySearch = require('../../utils').fuzzySearch;
var UserVCard = require('../common/VCard.react').UserVCard;
var UserActionCreators = require('../../actions/UserActionCreators');
var UserpicUploadForm = require('../../forms/UserpicUploadForm.react');

var VIEW_MODE = require('../../constants/CRMConstants').CONTACT_VIEW_MODE;
var URL_PREFIX   = require('../../constants/CRMConstants').URL_PREFIX;

var ProfileInformation = React.createClass({
    getInitialState: function() {
        return {mode: VIEW_MODE.READ};
    },

    getClosedCyclesNumber: function() {
      return SalesCycleStore.getClosedCyclesNumber(this.props.user);
    },

    getOpenedCyclesNumber: function() {
      return SalesCycleStore.getOpenedCyclesNumber(this.props.user);
    },

    onUserUpdate: function(updUser) {
        var user_id = this.props.user.id;
        UserActionCreators.editUser(user_id, updUser);
    },

    onUserpicUploadSubmit: function(object) {
        UserActionCreators.uploadUserpic(object);
    },

    getVCardMode: function() {
        return this.state.mode;
    },

    setMode: function(mode, evt) {
        evt.preventDefault();
        if(mode == VIEW_MODE.READ)
          this.refs.vcard_widget.triggerSubmit();
        this.setState({mode: mode});
        return false;
    },

    getAsideLink: function() {
      if(this.getVCardMode() == VIEW_MODE.READ)
        return <a onClick={this.setMode.bind(null, VIEW_MODE.EDIT)} href="#" className="text-secondary">Редактировать</a>
      return <a onClick={this.setMode.bind(null, VIEW_MODE.READ)} href="#" className="text-good text-padLeft">Сохранить</a>
    },

    resetState: function() {
        this.setState({mode: VIEW_MODE.READ});
    },

    render: function() {
        var user = this.props.user;
        var asideLink = this.getAsideLink();
        var closed_cycles = this.getClosedCyclesNumber()
        return (
            <div className="body-master">
              <div className="page page--breadcrumbsHeader">
                <div className="page-header">
                  <BreadCrumb slice={[1, -1]} />
                </div>
                <div className="page-body">

                  <div className="userProfile">
                    <div className="userProfile-header">
                        <figure className="userProfile-pic">
                          <img src={URL_PREFIX + user.userpic} className="userProfile-pic-img" alt="" />
                        </figure>
                        <UserpicUploadForm user={user} onHandleSubmit={this.onUserpicUploadSubmit} />
                    </div>
                  </div>

                  <UserVCard ref="vcard_widget"
                          onHandleSubmit={this.onUserUpdate}
                          user={user}
                          mode={this.getVCardMode()} />

                  <div className="contact-aside">
                    {asideLink}
                  </div>

                  <div className="space-verticalBorder"></div>

                  <ul className="userProfile-kpi">
                    <li className="userProfile-kpi-item">
                        <IconSvg iconKey="cart" />
                      Закрытых циклов: <strong className="userProfile-kpi-value">{closed_cycles.number} ($ {closed_cycles.money})</strong>
                    </li>
                    <li className="userProfile-kpi-item">
                        <IconSvg iconKey="clock" />
                      Открытых циклов на данный момент: <strong className="userProfile-kpi-value">{this.getOpenedCyclesNumber()}</strong>
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

});

var ProfileView = React.createClass({
    mixins: [AppContextMixin],

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    getInitialState: function() {
        return {
            user: UserStore.get(this.getUser().id)
        }
    },

    render: function() {
        return (
            <div>
                <Header />
                <div>
                    <ProfileInformation user={this.state.user} />
                    <ProfileFeed user={this.state.user} />
                </div>
                <Footer />
            </div>
        )
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    }
});

module.exports = ProfileView;
