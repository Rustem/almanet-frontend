/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
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
};

var ContactsSelected = React.createClass({
    mixins: [Router.State],

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
        console.log(this.props);
        return (
          <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page page--compact">
                        <div className="page-header">
                            {this.getParams()}
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

module.exports = ContactsSelected;
