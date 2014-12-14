/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var Router = require('react-router');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var ContactStore = require('../stores/ContactStore');
var ContactActionCreators = require('../actions/ContactActionCreators');
var BreadCrumb = require('./common/BreadCrumb.react');
var AllBase = require('./master_views').AllBase;
var SingleSelectedDetailView = require('./SingleSelectedDetailView.react');
var MultipleSelectedDetailView = require('./MultipleSelectedDetailView.react');

var _selected_contacts = [];

var EmptySelectedDetailView = React.createClass({

    render: function() {
        return <div />
    }

});


var ContactsSelectedView = React.createClass({

    mixins: [Router.State],

    getInitialState: function() {
        var selection_map = {};
        var contacts = ContactStore.getByDate(true);
        _selected_contacts = this.getQuery()['ids'] || [];
        var cnt = 0;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if(_selected_contacts.indexOf(contacts[i].id) > -1) {
                selection_map[contacts[i].id] = true;
                cnt += 1
            }
        }

        return {
            contacts: contacts,
            selection_map: selection_map,
            search_bar: {select_all: cnt === contacts.length, filter_text: ''}
        }
    },

    getFilterText: function() {
        return this.state.search_bar.filter_text;
    },

    getContacts: function() {
        return this.state.contacts;
    },

    getSelectMap: function() {
        return this.state.selection_map;
    },

    componentDidMount: function() {
        ContactStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(nextProps, nextState) {
        ContactStore.removeChangeListener(this._onChange);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        var cur_ids = [], n = 0;

        function getSelectedIds(_map) {
            var cids = [];

            for(var contact_id in _map) {
                var is_selected = _map[contact_id];
                if(is_selected) {
                    cids.push(contact_id);
                }
            }
            return cids;
        }

        cur_ids = getSelectedIds(nextState.selection_map);
        _selected_contacts = cur_ids;
        return true;
    },

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            contacts = null;
        if(value.filter_text) {
            contacts = ContactStore.fuzzySearch(value.filter_text, {'asc': false});
        } else {
            contacts = ContactStore.getByDate(true);
        }
        for(var contact_id in this.state.selection_map) {
            _map[contact_id] = false;
        }
        for(var i = 0; i<contacts.length; i++) {
            contact_id = contacts[i].id;
            if(changed) {
                _map[contact_id] = value.select_all;
            } else if(value.select_all) {
                _map[contact_id] = true;
            } else {
                _map[contact_id] = this.state.selection_map[contact_id];
            }
        }

        var newState = React.addons.update(this.state, {
            contacts: {$set: contacts},
            selection_map: {$set: _map},
            search_bar: {$set: value},
        });
        this.setState(newState);
    },

    onToggleListItem: function(contact_id, is_selected) {
        var updItem = {};
        updItem[contact_id] = is_selected;
        var newState = React.addons.update(this.state, {
            selection_map: {$merge: updItem}
        });
        this.setState(newState);
    },

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.allbase_list.getSelectedContacts();
        if(_.size(selected_contacts) == 0) {
            console.log('Choose at least one contact');
            return
        }
        console.log('You has chosen to ' + actionType, selected_contacts);
    },

    onHandleEditContact: function(contact_id, updContact) {
        ContactActionCreators.editContact(contact_id, updContact);
    },

    render: function() {
        var contact_ids = [], DetailView = null;
        for(var contact_id in this.state.selection_map)
            if(this.state.selection_map[contact_id])
                contact_ids.push(contact_id);
        if(contact_ids.length === 0) {
            DetailView = (<EmptySelectedDetailView />);
        } else if(contact_ids.length === 1) {
            DetailView = (
                <SingleSelectedDetailView contact_id={contact_ids[0]}
                                          onHandleEditContact={this.onHandleEditContact.bind(null, contact_ids[0])} />
            );
        } else {
            DetailView = (
                <MultipleSelectedDetailView contact_ids={contact_ids} />
            );
        }

        return (
          <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page">
                        <div className="page-header">
                            <BreadCrumb slice={[1, -1]} />
                            <AllBase.FilterBar
                                ref='filter_bar'
                                value={this.state.search_bar}
                                onHandleUserInput={this.onFilterBarUpdate}
                                onUserAction={this.onUserAction} />
                        </div>
                        <AllBase.AllBaseList
                            ref="allbase_list"
                            contacts={this.getContacts()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onToggleListItem} />
                    </div>
                </div>
                <div className="body-detail">
                    {DetailView}
                </div>
            </div>
            <Footer />
          </div>
        );
    },
    _onChange: function() {
        this.setState(this.getInitialState());
    }

});


module.exports = ContactsSelectedView;
