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
var ContactVCard = require('../contacts/ContactVCard.react');

var VIEW_MODE = require('../../constants/CRMConstants').CONTACT_VIEW_MODE;

var ProfileInformation = React.createClass({
    getInitialState: function() {
        return {mode: VIEW_MODE.READ};
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.resetState);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.resetState);
    },

    getOpenedCyclesNumber: function() {
      return SalesCycleStore.getOpenedCyclesNumber(this.props.user);
    },

    onUserUpdate: function(updContact) {
        // var contact_id = this.getParams().id;
        // ContactActionCreators.editContact(contact_id, updContact);
    },

    getVCardMode: function() {
        return this.state.mode;
    },

    setMode: function(mode, evt) {
        evt.preventDefault();
        if(mode == VIEW_MODE.READ)
          // this.refs.vcard_widget.triggerSubmit();
          console.log(mode)
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

                  <ContactVCard ref="vcard_widget"
                          onHandleSubmit={this.onUserUpdate}
                          contact={user}
                          mode={this.getVCardMode()} />

                  <div className="contact-aside">
                    {asideLink}
                  </div>

                  <div className="space-verticalBorder"></div>

                  <ul className="userProfile-kpi">
                    <li className="userProfile-kpi-item">
                        <IconSvg iconKey="cart" />
                      Закрытых циклов: <strong className="userProfile-kpi-value">20 ($ 1000)</strong>
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
