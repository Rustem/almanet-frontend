/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var master_views = require('./master_views');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var ShareStore = require('../stores/ShareStore');
var ContactStore = require('../stores/ContactStore');
var UserActionCreators = require('../actions/UserActionCreators');
var BreadCrumb = require('./common/BreadCrumb.react');
var ColdBase = require('./master_views').ColdBase;

var ShareContactSelected = React.createClass({
    mixins : [Router.Navigation, Router.State],
    getInitialState: function() {
        var selection_map = {};
        var contacts = ContactStore.getColdByDate(true);
        var selected_id = this.getParams().id;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if(contacts[i].id === selected_id) {
                selection_map[contacts[i].id] = true;
            }
        }
        return {
            contacts: contacts,
            selection_map: selection_map,
            search_bar: {select_all: false, filter_text: ''}
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
        var cids = [], n = 0;
        for(var contact_id in nextState.selection_map) {
            var is_selected = nextState.selection_map[contact_id];
            if(is_selected) {
                cids.push(contact_id);
                n += 1;
            }
        }
        console.log(cids, "sfa;asdf;sad");
        if(n > 1) {
            this.transitionTo('share_contacts_selected', {'ids': cids});
        }
        return n <= 1;
    },
    onHandleUserInput: function(value) {
        var is_selected = value.select_all;
        var _map = {};
        for(var contact_id in this.state.selection_map) {
            _map[contact_id] = is_selected;
        }
        this.state.selection_map = _map;
        this.state.search_bar = value;
        this.setState(this.state);
    },
    onChangeState: function(contact_id, is_selected) {
        this.state.selection_map[contact_id] = is_selected;
        this.setState(this.state);
    },

    render: function() {
        return (
          <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page">
                        <div className="page-header">
                            <BreadCrumb slice={[1, -1]} />
                            <ColdBase.FilterBar
                                ref='filter_bar'
                                value={this.state.search_bar}
                                onHandleUserInput={this.onHandleUserInput}
                                onUserAction={this.onUserAction} />
                        </div>
                        <ColdBase.ColdBaseList
                            ref="coldbase_list"
                            filter_text={this.getFilterText()}
                            contacts={this.getContacts()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onChangeState} />
                    </div>
                </div>
                <div className="body-detail">
                    <RouteHandler />
                </div>
            </div>
            <Footer />
          </div>
        );
    },

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.coldbase_list.getSelectedContacts();
        if(_.size(selected_contacts) == 0) {
            console.log('Choose at least one contact');
            return
        }
        console.log('You has chosen to ' + actionType, selected_contacts);
    },
    _onChange: function() {
        this.setState(this.getInitialState());
    }

});

module.exports = ShareContactSelected;
