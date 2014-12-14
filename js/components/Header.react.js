/**
 * @jsx React.DOM
 */

var React = require('react');
var IconSvg = require('./common/IconSvg.react');
var ContactComposer = require('./ContactComposer.react');
var AppContextMixin = require('../mixins/AppContextMixin');

var Header = React.createClass({
    mixins : [AppContextMixin],

    render: function() {
        return (
            <div className="body-header nav">
                <div className="nav-a">
                  <a href="index.html" className="nav-link active">
                    Контакты
                  </a><a href="#" className="nav-link">
                    События
                  </a><a href="#" className="nav-link">
                    Продукты
                  </a><a href="#" className="nav-link">
                    Поиск
                  </a><a href="#" className="nav-link">
                    Отчеты
                  </a>
                </div>
                <div className="nav-b">
                  <ContactComposer />
                  <button type="button" onClick={this.onToggleNotificationBar} className="nav-link">
                    <IconSvg iconKey="notifications" />
                  </button>
                </div>
            </div>

        );
    },

    onToggleNotificationBar: function() {
      this.context.toggleNotifCenter();
    }

});

module.exports = Header;
