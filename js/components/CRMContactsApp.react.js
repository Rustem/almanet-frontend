/**
 * @jsx React.DOM
 */

var React = require('react');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var MainBody = require('./MainBody.react')
var SessionStore = require('../stores/SessionStore');
var UserActionCreators = require('../actions/UserActionCreators');



function getAppState() {
    return {
        current_user: SessionStore.current_user(),
        isAuth: SessionStore.loggedIn()
    }
}

var CRMContactsApp = React.createClass({

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

    // componentWillMount: function() {
    //     UserActionCreators.loadCurrentUser();
    // },
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
          <div className="body-container">
            <Header />
            <MainBody {...this.props} />
            <Footer />
          </div>
        );
    }

});

module.exports = CRMContactsApp;
