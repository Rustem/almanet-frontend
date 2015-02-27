/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactInstanceHandles = require("react/lib/ReactInstanceHandles");
var cx = React.addons.classSet;
var Router = require('react-router');
var Link = Router.Link;
var AppContextMixin = require('../../mixins/AppContextMixin');
var IconSvg = require('../common/IconSvg.react');
var UserStore = require('../../stores/UserStore');

var LOGOUT_URL = require('../../constants/CRMConstants').LOGOUT_URL;
var URL_PREFIX   = require('../../constants/CRMConstants').URL_PREFIX;

var ESCAPE_KEY_CODE = 27;


var ProfileNavigator = React.createClass({
    mixins: [AppContextMixin],

    getInitialState: function() {
        return {
            user: UserStore.get(this.getUser().crm_user_id) || this.getUser(),
            isOpen: false
        }
    },

    componentDidMount: function() {
      UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);

      this._removeEvents();
    },

    componentDidUpdate: function(prevProps, prevState) {
        (this.state.isOpen ? this._addEvents : this._removeEvents)();
        // if( this.state.isOpen ) {
        //     this._addEvents();
        // } else {
        //     this._removeEvents();
        // }
    },

    _addEvents: function() {
        window.addEventListener('click', this.handleClick);
        window.addEventListener('keyup', this.handleKeyUp);
    },

    _removeEvents: function() {
        window.removeEventListener('click', this.handleClick);
        window.removeEventListener('keyup', this.handleKeyUp);
    },

    handleClick: function(evt) {
        if( !ReactInstanceHandles.isAncestorIDOf(this.getDOMNode().dataset.reactid, evt.target.dataset.reactid) ) {
            this.setState({
                isOpen: false
            });
        }
    },

    handleKeyUp: function(evt) {
        if( (evt.which || evt.keyCode) === ESCAPE_KEY_CODE ) {
            this.setState({
                isOpen: false
            });
        }
    },

    onToggleMenu: function(e) {
        e.preventDefault();
        this.setState({
            isOpen: !this.state.isOpen
        })
    },

    _onChange: function() {
      this.setState(this.getInitialState());
    },

    render: function() {
        var user = this.state.user;
        var classes = cx({
            'dropdown': true,
            'dropdown--inline': true,
            'dropdown--right': true,
            'open': this.state.isOpen,
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
    }

});

module.exports = ProfileNavigator;
