/**
 * @jsx React.DOM
 */

var React = require('react');
var Header = require('./Header.react.js');
var Footer = require('./Footer.react.js');
var MainSection = require('./MainSection.react.js');

var CRMContactsApp = React.createClass({

    render: function() {
        return (
          <div className="body-container">
            <Header />
            <MainSection />
            <Footer />
          </div>
        );
    }

});

module.exports = CRMContactsApp;
