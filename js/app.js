/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.

var React = require('react');
var routes = require('./router');
var Routes = require('react-router').Routes;
var CRMContactsApp = require('./components/CRMContactsApp.react');


// ChatExampleData.init(); // load example data into localstorage


React.renderComponent(
  <Routes children={routes}/>,
  document.getElementById('js-crm-app')
);
