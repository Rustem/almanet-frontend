/**
 * @jsx React.DOM
 */

var React = require('react');

var ContactComposer = require('./ContactComposer.react');

var Header = React.createClass({

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
                </div>
            </div>

        );
    }

});

module.exports = Header;
