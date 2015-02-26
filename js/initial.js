var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var whenKeysAll = require('when/keys').all;
var BreadcrumbStore = require('./stores/BreadcrumbStore');
var routes = require('./router').routes;
var NODES = require('./router').NODES;
var relationships = require('./router').relationships;


var moment = require('moment');
var moment_locale_ru = require('moment/locale/ru');

function configure() {
  moment.locale('ru', moment_locale_ru);
};

function initial_load(callback) {
  var AppActionCreators = require('./actions/AppActionCreators');
  var AuthWebAPI = require('./api/AuthWebAPI');
  var AppWebAPI = require('./api/AppWebAPI');
  var CommentWebAPI = require('./api/CommentWebAPI');
  var NotificationWebAPI = require('./api/NotificationWebAPI');

  AuthWebAPI.loadCurrentUser(function(user){
    AppWebAPI.getAll(function(appState, appConstants){
        CommentWebAPI.getAll(function(comments){
              NotificationWebAPI.getAll(function(notifications){

                appState = _.assign(appState, {
                  user: user,
                  comments: comments,
                  notifications: notifications,
                  constants: appConstants,
                });

                AppActionCreators.load(appState);
                
                callback();
                
              });
          });
      });
  });
};

function global_render() {

  // breadcrumb store is mutable store but the logic remaining as flux
  BreadcrumbStore.initialize(NODES, relationships);

  // render app

  configure();
  Router.run(routes, function(Handler, state){
      // create the promises hash
      var promises = state.routes.filter(function (route) {
        // gather up the handlers that have a static `fetchData` method
        return route.handler.fetchData;
      }).reduce(function (promises, route) {
        // reduce to a hash of `key:promise`
        promises[route.name] = route.handler.fetchData(state.params);
        return promises;
      }, {});

      whenKeysAll(promises).then(function (data) {
        // wait until we have data to render, the old screen stays up
        // until we render
        BreadcrumbStore.update(state.routes, state.params, state.query);
        React.render(<Handler />, document.getElementById('js-crm-app'));
      });
  });
}

module.exports = {
  initial_load: initial_load,
  global_render: global_render,
};
