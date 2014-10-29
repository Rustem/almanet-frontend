/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.

var React = require('react');
window.React = React; // export for http://fb.me/react-devtools

var CRMContactsApp = require('./components/CRMContactsApp.react');


// ChatExampleData.init(); // load example data into localstorage

// ChatWebAPIUtils.getAllMessages();
React.renderComponent(
    <CRMContactsApp />,
    document.getElementById('js-crm-app')
);
