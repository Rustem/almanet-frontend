/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.
var _ = require('lodash');
var RSVP = require('rsvp');
var React = require('react');
var InitialLoadingView = require('./components/common/InitialLoadingView.react');

// var moment = require('moment');
// var moment_locale_ru = require('moment/locale/ru');
// //var Fixtures = require('./fixtures');
// //Fixtures.init();

// // TODO: use promises
// // load initial data to services

// function configure() {
//   moment.locale('ru', moment_locale_ru);
// };

function render_app() {
    React.render(<InitialLoadingView />, document.getElementById('js-crm-app'));
}

render_app();

// var Fuse = require('./libs/fuse');
// var books = [{
//   id: 1,
//   title: 'The Great Gatsby',
//   author: 'F. Scott Fitzgerald'
// },{
//   id: 2,
//   title: 'The DaVinci Code',
//   author: 'Dan Brown'
// },{
//   id: 3,
//   title: 'Angels & Demons',
//   author: 'Dan Brown'
// }];

// Example 1
// var options = {
//   keys: ['author', 'title'],   // keys to search in
//   id: 'id'                     // return a list of identifiers only
// }
// var f = new Fuse(books, options);
// var result = f.search('brwn'); // Fuzzy-search for pattern 'brwn'

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
