/**
 * @jsx React.DOM
 */

var React = require('react');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var MainBody = require('./MainBody.react')

var CRMContactsApp = React.createClass({

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
