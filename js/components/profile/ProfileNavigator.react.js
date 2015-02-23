/**
 * @jsx React.DOM
 */

var React = require('react');
var cx = React.addons.classSet;
var Router = require('react-router');
var Link = Router.Link;
var AppContextMixin = require('../../mixins/AppContextMixin');
var IconSvg = require('../common/IconSvg.react');
var UserStore = require('../../stores/UserStore');

var LOGOUT_URL = require('../../constants/CRMConstants').LOGOUT_URL;
var URL_PREFIX   = require('../../constants/CRMConstants').URL_PREFIX;

var ProfileNavigator = React.createClass({
    mixins: [AppContextMixin],

    getInitialState: function() {
        return {
            user: UserStore.get(this.getUser().crm_user_id) || this.getUser()
        }
    },

    componentWillMount: function() {
      this.opened = false;
    },

    componentDidMount: function() {
      UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);
    },

    onToggleMenu: function(e) {
        e.preventDefault();
        this.opened = !this.opened;
        this.forceUpdate();
    },

    render: function() {
        var user = this.state.user;
        var classes = cx({
            'dropdown': true,
            'dropdown--inline': true,
            'dropdown--right': true,
            'open': this.opened,
        })
        return (
            <div className={classes}>
                <a className="nav-link" onClick={this.onToggleMenu}>
                  <div className="row-body row-body--inverted">
                    <div className="row-body-secondary">
                        <IconSvg iconKey="arrow-down" />
                    </div>
                    <div className="row-body-primary">
                      <figure className="icon-userpic">
                        <img src={URL_PREFIX + user.userpic} />
                      </figure>
                      {user.vcard.fn}
                    </div>
                  </div>
                </a>
                <div className="dropdown-menu">
                  <div className="dropdown-menu-body">
                    <ul className="dropdown-menu-list">
                      <li><Link className="dropdown-menu-link" to="profile">Профиль</Link></li>
                      <li><a href={LOGOUT_URL} className="dropdown-menu-link">Выход</a></li>
                    </ul>
                  </div>
                </div>
            </div>
        )
    },

    _onChange: function() {
      this.opened = false;
      this.setState(this.getInitialState());
    }
});

module.exports = ProfileNavigator;
