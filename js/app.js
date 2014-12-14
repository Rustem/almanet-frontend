/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.
var RSVP = require('rsvp');
var React = require('react');
var Router = require('react-router');
var AppActionCreators = require('./actions/AppActionCreators');
var ContactWebAPI = require('./api/ContactWebAPI');
var AuthWebAPI = require('./api/AuthWebAPI');
var UserWebAPI = require('./api/UserWebAPI');
var ActivityWebAPI = require("./api/ActivityWebAPI");
var SalesCycleWebAPI = require("./api/SalesCycleWebAPI");
var ProductWebAPI = require('./api/ProductWebAPI');
var NotificationWebAPI = require('./api/NotificationWebAPI');
var BreadcrumbStore = require('./stores/BreadcrumbStore');
var routes = require('./router').routes;
var NODES = require('./router').NODES;
var relationships = require('./router').relationships;
var Fixtures = require('./fixtures');

Fixtures.init();
// TODO: use promises
// load initial data to services
AuthWebAPI.loadCurrentUser(function(user){
    ContactWebAPI.getAllContacts(function(contacts){
        ContactWebAPI.getAllShares(function(shares){
            UserWebAPI.getAll(function(users){
                ActivityWebAPI.getAll(function(activities){
                    SalesCycleWebAPI.getAll(function(salescycles){
                        ProductWebAPI.getAll(function(products){
                            NotificationWebAPI.getAll(function(notifications){
                              var appState = {
                                  user: user,
                                  contacts: contacts,
                                  shares: shares,
                                  users: users,
                                  activities: activities,
                                  salescycles: salescycles,
                                  products: products,
                                  notifications: notifications
                              };
                              AppActionCreators.load(appState);
                              // breadcrumb store is mutable store but the logic remaining as flux
                              BreadcrumbStore.initialize(NODES, relationships);
                              // render app
                              Router.run(routes, function(Handler, state){
                                  BreadcrumbStore.update(state.routes, state.params, state.query);
                                  React.render(<Handler />, document.getElementById('js-crm-app'));
                              })
                            });
                        });
                    });
                });
            });
        });
    });

});


var Fuse = require('./libs/fuse');
var books = [{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
},{
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
},{
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];

// Example 1
var options = {
  keys: ['author', 'title'],   // keys to search in
  id: 'id'                     // return a list of identifiers only
}
var f = new Fuse(books, options);
var result = f.search('brwn'); // Fuzzy-search for pattern 'brwn'
console.log(result);

// var PourOver = require('./libs/pourover');

// var data = [
//     {name: "bob", eyes: 2, sex: "m"},
//     {name: "margo", eyes: 1, sex: "f"},
//     {name: "chuckles", eyes: 2, sex: "f"}], collection;

// collection = new PourOver.Collection(data);
// collection.addItems({name: 'amy', eyes: 1, sex: 'f'});
// console.log(collection.items);

// collection.updateItem(1, "name", "margot");
// console.log(collection.items);

// // filters
// var eye_filter = PourOver.makeExactFilter('eyes', [0, 1, 2]);
// collection.addFilters(eye_filter);
// collection.filters.eyes.query(1);

// // statefully
// var one_eyed_cids = collection.filters.eyes.current_query.cids,
//     one_eyed_people = collection.get(one_eyed_cids);
// console.log(one_eyed_cids, one_eyed_people);

// // combining filters
// var sex_filter = PourOver.makeExactFilter('sex', ['m', 'f']);
// collection.addFilters(sex_filter);

// // stateless
// var two_eyeds = collection.getFilteredItems('eyes', 2),
//     women  = collection.getFilteredItems('sex', 'f'),
//     output_cids = two_eyeds.and(women).cids,
//     two_eyed_women = collection.get(output_cids)
// console.log("two eyed women: ", two_eyed_women);

// // stateful
// collection.filters.eyes.query(1);
// collection.filters.eyes.unionQuery(2);
// var total_cids = collection.filters.eyes.current_query.cids,
//     total_people = collection.get(total_cids);
// console.log("one, two eyed people", total_people);
