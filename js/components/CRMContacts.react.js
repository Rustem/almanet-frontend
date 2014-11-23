/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var master_views = require('./master_views');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var SessionStore = require('../stores/SessionStore');
var UserActionCreators = require('../actions/UserActionCreators');
var BreadCrumb = require('./common/BreadCrumb.react');


function getAppState() {
    return {
        current_user: SessionStore.current_user(),
        isAuth: SessionStore.loggedIn()
    }
}

var CRMContacts = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    childContextTypes: {
        user: React.PropTypes.object,
        isAuth: React.PropTypes.bool
    },

    getChildContext: function() {
        return {
            user: this.state.current_user,
            isAuth: this.state.isAuth
        };
    },
    componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        SessionStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(getAppState());
    },
    render: function() {
        return (
          <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page page--compact">
                        <div className="page-header">
                            <BreadCrumb slice={[1, -1]} />
                        </div>
                        <div className="page-body">
                            <master_views.Shared.Link label="Входящие" />
                            <master_views.ColdBase.Link label="Холодная база" />
                        </div>
                    </div>
                </div>
                <div className="body-detail">
                    <RouteHandler />
                </div>
            </div>
            <Footer />
          </div>
        );
    }

});

module.exports = CRMContacts;
