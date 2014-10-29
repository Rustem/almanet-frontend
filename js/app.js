/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.

var CRMContactsApp = require('./components/CRMContactsApp.react');
var React = require('react');
window.React = React; // export for http://fb.me/react-devtools

// ChatExampleData.init(); // load example data into localstorage

// ChatWebAPIUtils.getAllMessages();

React.renderComponent(
    <CRMContactsApp />,
    document.getElementById('crm')
);
