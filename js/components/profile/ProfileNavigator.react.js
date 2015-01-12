/**
 * @jsx React.DOM
 */

var React = require('react');
var cx = React.addons.classSet;
var Router = require('react-router');
var Link = Router.Link;
var AppContextMixin = require('../../mixins/AppContextMixin');
var IconSvg = require('../common/IconSvg.react');

var ProfileNavigator = React.createClass({
    mixins: [AppContextMixin],

    componentWillMount: function() {
        this.opened = false;
    },

    onToggleMenu: function(e) {
        e.preventDefault();
        this.opened = !this.opened;
        this.forceUpdate();
    },

    render: function() {
        var user = this.getUser();
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
                        <img src={"img/userpics/"+user.userpic} />
                      </figure>
                      {user.first_name}
                    </div>
                  </div>
                </a>
                <div className="dropdown-menu">
                  <div className="dropdown-menu-body">
                    <ul className="dropdown-menu-list">
                      <li><Link className="dropdown-menu-link" to="profile">Профиль</Link></li>
                      <li><a href="#" className="dropdown-menu-link">Настройки</a></li>
                      <li><a href="#" className="dropdown-menu-link">Администрирование</a></li>
                      <li><a href="#" className="dropdown-menu-link">Выход</a></li>
                    </ul>
                  </div>
                </div>
            </div>
        )
    }
});

module.exports = ProfileNavigator;
