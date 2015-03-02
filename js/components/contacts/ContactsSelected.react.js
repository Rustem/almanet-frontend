/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var fuzzySearch = require('../../utils').fuzzySearch;
var Router = require('react-router');
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var ContactStore = require('../../stores/ContactStore');
var ShareStore = require('../../stores/ShareStore');
var FilterStore = require('../../stores/FilterStore');
var ActivityStore = require('../../stores/ActivityStore');
var ContactActionCreators = require('../../actions/ContactActionCreators');
var AppContextMixin = require('../../mixins/AppContextMixin');
var BreadCrumb = require('../common/BreadCrumb.react');
var AllBase = require('./master_views').AllBase;
var SharedBase = require('./master_views').Shared;
var RecentBase = require('./master_views').Recent;
var ColdBase = require('./master_views').ColdBase;
var LeadBase = require('./master_views').LeadBase;
var Filtered = require('./master_views').Filtered;
var SingleSelectedDetailView = require('./SingleSelectedDetailView.react');
var MultipleSelectedDetailView = require('./MultipleSelectedDetailView.react');
var CommonFilterBar = require('./FilterComposer.react').CommonFilterBar;
var EmptyView = require('../common/EmptyView.react');

var _selected_contacts = [];

var ContactsSelectedViewMixin = {

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
        ActivityStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(nextProps, nextState) {
        ContactStore.removeChangeListener(this._onChange);
        ActivityStore.removeChangeListener(this._onChange);
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

    onToggleListItem: function(contact_id, is_selected) {
        var updItem = {};
        updItem[contact_id] = is_selected;
        var newState = React.addons.update(this.state, {
            selection_map: {$merge: updItem}
        });
        this.setState(newState);
    },

    onHandleEditContact: function(contact_id, updContact) {
        ContactActionCreators.editContact(contact_id, updContact);
    },

    render: function() {
        var contact_ids = [], DetailView = null, FilterBar = null, List = null;
        for(var contact_id in this.state.selection_map)
            if(this.state.selection_map[contact_id])
                contact_ids.push(contact_id);
        if(contact_ids.length === 0) {
            DetailView = (<EmptyView />);
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
        var List = this.getList();

        return (
          <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page">
                        <div className="page-header">
                            <BreadCrumb slice={[1, -1]} />
                            <CommonFilterBar
                                ref='filter_bar'
                                value={this.state.search_bar}
                                onHandleUserInput={this.onFilterBarUpdate}
                                onUserAction={this.onUserAction} />
                        </div>
                        {List}
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

}

var AllBaseSelectedView = React.createClass({
    mixins:[Router.State, ContactsSelectedViewMixin],

    getList: function() {
        return <AllBase.AllBaseList
                            ref="allbase_list"
                            contacts={this.getContacts()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onToggleListItem} />
    },

    getInitialState: function() {
        var selection_map = {},
            contacts = ContactStore.getByDate(true);

        _selected_contacts = this.getQuery()['ids'] || [];
        var cnt = 0;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if( _.find(_selected_contacts, function (x){ return x == contacts[i].id }) ) {
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

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.allbase_list.getSelectedContacts();

        if(_.size(selected_contacts) == 0) {
            console.log('Choose at least one contact');
            return
        }
        console.log('You has chosen to ' + actionType, selected_contacts);
    },

    _onChange: function() {
        var contacts = null,
            newSelectionItems = {};

        contacts = ContactStore.getByDate(true);
        for(var i = 0; i<contacts.length; i++) {
            if(!contacts[i].id in this.state.selection_map) {
                newSelectionItems[contacts[i].id] = false;
            }
        }
        if(!newSelectionItems) {
            return
        } else {
            var newState = React.addons.update(this.state, {
                contacts: {$set: contacts},
                selection_map: {$merge: newSelectionItems}
            });
            this.setState(newState);
        }
    }
});

var RecentBaseSelectedView = React.createClass({
    mixins:[Router.State, ContactsSelectedViewMixin, AppContextMixin],

    getList: function() {
        return <RecentBase.RecentList
                            ref="recentbase_list"
                            contacts={this.getContacts()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onToggleListItem} />
    },

    getInitialState: function() {
        var selection_map = {},
            contacts = ContactStore.getRecent(this.getUser());

        _selected_contacts = this.getQuery()['ids'] || [];
        var cnt = 0;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if( _.find(_selected_contacts, function (x){ return x == contacts[i].id }) ) {
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

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            contacts = null;
        if(value.filter_text) {
            contacts = ContactStore.fuzzySearch(value.filter_text, {'asc': false});
        } else {
            contacts = ContactStore.getRecent(this.getUser());
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

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.recentbase_list.getSelectedContacts();

        if(_.size(selected_contacts) == 0) {
            console.log('Choose at least one contact');
            return
        }
        console.log('You has chosen to ' + actionType, selected_contacts);
    },

    _onChange: function() {
        var contacts = null,
            newSelectionItems = {};

        contacts = ContactStore.getRecent(this.getUser());
        for(var i = 0; i<contacts.length; i++) {
            if(!contacts[i].id in this.state.selection_map) {
                newSelectionItems[contacts[i].id] = false;
            }
        }
        if(!newSelectionItems) {
            return
        } else {
            var newState = React.addons.update(this.state, {
                contacts: {$set: contacts},
                selection_map: {$merge: newSelectionItems}
            });
            this.setState(newState);
        }
    }
});

var ColdBaseSelectedView = React.createClass({
    mixins:[Router.State, ContactsSelectedViewMixin],

    getList: function() {
        return <ColdBase.ColdBaseList
                            ref="coldbase_list"
                            contacts={this.getContacts()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onToggleListItem} />
    },

    getInitialState: function() {
        var selection_map = {},
            contacts = ContactStore.getColdByDate(true);

        _selected_contacts = this.getQuery()['ids'] || [];
        var cnt = 0;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if( _.find(_selected_contacts, function (x){ return x == contacts[i].id }) ) {
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

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            contacts = null;
        if(value.filter_text) {
            contacts = ContactStore.fuzzySearch(value.filter_text, {'asc': false});
        } else {
            contacts = ContactStore.getColdByDate(true);
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
        var contacts = null,
            newSelectionItems = {};

        contacts = ContactStore.getColdByDate();
        for(var i = 0; i<contacts.length; i++) {
            if(!contacts[i].id in this.state.selection_map) {
                newSelectionItems[contacts[i].id] = false;
            }
        }
        if(!newSelectionItems) {
            return
        } else {
            var newState = React.addons.update(this.state, {
                contacts: {$set: contacts},
                selection_map: {$merge: newSelectionItems}
            });
            this.setState(newState);
        }
    }
});

var LeadBaseSelectedView = React.createClass({
    mixins:[Router.State, ContactsSelectedViewMixin, AppContextMixin],

    getList: function() {
        return <LeadBase.LeadBaseList
                            ref="leadbase_list"
                            contacts={this.getContacts()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onToggleListItem} />
    },

    getInitialState: function() {
        var selection_map = {},
            contacts = ContactStore.getLeads(this.getUser());

        _selected_contacts = this.getQuery()['ids'] || [];
        var cnt = 0;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if( _.find(_selected_contacts, function (x){ return x == contacts[i].id }) ) {
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

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            contacts = null;
        if(value.filter_text) {
            contacts = ContactStore.fuzzySearch(value.filter_text, {'asc': false});
        } else {
            contacts = ContactStore.getLeads(this.getUser());
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

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.leadbase_list.getSelectedContacts();

        if(_.size(selected_contacts) == 0) {
            console.log('Choose at least one contact');
            return
        }
        console.log('You has chosen to ' + actionType, selected_contacts);
    },

    _onChange: function() {
        var contacts = null,
            newSelectionItems = {};

        contacts = ContactStore.getLeads(this.getUser());
        for(var i = 0; i<contacts.length; i++) {
            if(!contacts[i].id in this.state.selection_map) {
                newSelectionItems[contacts[i].id] = false;
            }
        }
        if(!newSelectionItems) {
            return
        } else {
            var newState = React.addons.update(this.state, {
                contacts: {$set: contacts},
                selection_map: {$merge: newSelectionItems}
            });
            this.setState(newState);
        }
    }
});

var SharedBaseSelectedView = React.createClass({
    mixins:[Router.State, ContactsSelectedViewMixin],

    getList: function() {
        return <SharedBase.SharesList
                            ref="sharedbase_list"
                            contacts={this.getContacts()}
                            shares={this.getShares()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onToggleListItem} />
    },

    getShares: function() {
        return this.state.shares;
    },

    getInitialState: function() {
        var contacts = [], contact_ids = [], selection_map = {}, cnt = 0;
        var shares = ShareStore.sortedByDate();
        _selected_contacts = this.getQuery()['ids'] || [];
        contact_ids = shares.map(function(share){ return share.contact });
        contacts = ContactStore.getByIds(contact_ids);

        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if( _.find(_selected_contacts, function (x){ return x == contacts[i].id }) ) {
                selection_map[contacts[i].id] = true;
                cnt += 1
            }
        }

        return {
            contacts: contacts,
            shares: shares,
            selection_map: selection_map,
            search_bar: {select_all: cnt === contacts.length, filter_text: ''}
        }
    },

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            contacts = null, shares = null;
        if(value.filter_text) {
            shares = ShareStore.fuzzySearch(value.filter_text, {'asc': false});
        } else {
            shares = ShareStore.sortedByDate();
        }
        var contact_ids = shares.map(function(share){ return share.contact });
        contacts = ContactStore.getByIds(contact_ids);
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
            shares: {$set: shares},
            selection_map: {$set: _map},
            search_bar: {$set: value},
        });
        this.setState(newState);
    },

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.sharedbase_list.getSelectedContacts();

        if(_.size(selected_contacts) == 0) {
            console.log('Choose at least one contact');
            return
        }
        console.log('You has chosen to ' + actionType, selected_contacts);
    },

    _onChange: function() {
        var shares = null,
            newSelectionItems = {};

        shares = ShareStore.sortedByDate();
        var contact_ids = shares.map(function(share){ return share.contact });
        contacts = ContactStore.getByIds(contact_ids);
        for(var i = 0; i<contacts.length; i++) {
            if(!contacts[i].id in this.state.selection_map) {
                newSelectionItems[contacts[i].id] = false;
            }
        }
        if(!newSelectionItems) {
            return
        } else {
            var newState = React.addons.update(this.state, {
                shares: {$set: shares},
                contacts: {$set: contacts},
                selection_map: {$merge: newSelectionItems}
            });
            this.setState(newState);
        }
    }
});

var FilteredSelectedView = React.createClass({
    mixins:[Router.State, ContactsSelectedViewMixin, AppContextMixin],

    getList: function() {
        return <Filtered.FilteredList
                            ref="filtered_list"
                            contacts={this.getContacts()}
                            selection_map={this.getSelectMap()}
                            onChangeState={this.onToggleListItem} />
    },

    getFilter: function() {
        var f_id = this.getQuery()['f_id'];
        return FilterStore.get(f_id);
    },

    getDefaultContacts: function() {
        var filter = this.getFilter();
        if(!filter)
            return [];
        switch(filter.base) {
            case 'all':
                return ContactStore.getByDate(true);
            case 'recent':
                return ContactStore.getRecent(this.getUser());
            case 'cold':
                return ContactStore.getColdByDate(true);
            case 'lead':
                return ContactStore.getLeads(this.getUser());
        }
    },

    applyFilter: function(value) {
        if(!value)
            return [];
        var contacts = this.getDefaultContacts();
        if(value.filter_text)
            contacts = fuzzySearch(contacts, value.filter_text, {
                'keys': ['vcard.fn', 'vcard.emails.value']});
        return contacts;
    },
    
    getInitialState: function() {
        var selection_map = {}, filter = this.getFilter(), 
            contacts = this.applyFilter(filter);

        _selected_contacts = this.getQuery()['ids'] || [];
        var cnt = 0;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if(_.find(_selected_contacts, function (x){ return x == contacts[i].id })) {
                selection_map[contacts[i].id] = true;
                cnt += 1
            }
        }

        return {
            contacts: contacts,
            selection_map: selection_map,
            search_bar: {select_all: cnt === contacts.length, filter_text: filter.filter_text}
        }
    },

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            contacts = null;
        contacts = this.applyFilter(value);
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

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.filtered_list.getSelectedContacts();
        
        if(_.size(selected_contacts) == 0) {
            console.log('Choose at least one contact');
            return
        }
        console.log('You has chosen to ' + actionType, selected_contacts);
    },

    _onChange: function() {
        var contacts = null,
            newSelectionItems = {};
        
        contacts = this.getDefaultContacts();
        for(var i = 0; i<contacts.length; i++) {
            if(!contacts[i].id in this.state.selection_map) {
                newSelectionItems[contacts[i].id] = false;
            }
        }
        if(!newSelectionItems) {
            return
        } else {
            var newState = React.addons.update(this.state, {
                contacts: {$set: contacts},
                selection_map: {$merge: newSelectionItems}
            });
            this.setState(newState);
        }
    }
});

var ContactsSelectedView = React.createClass({
    mixins: [Router.State],

    render: function() {
        var Component = null;
        var menu = this.getParams().menu;
        switch(menu) {
            case 'shared':
                Component = SharedBaseSelectedView;
                break;
            case 'allbase':
                Component = AllBaseSelectedView;
                break;
            case 'recent':
                Component = RecentBaseSelectedView;
                break;
            case 'coldbase':
                Component = ColdBaseSelectedView;
                break;
            case 'leadbase':
                Component = LeadBaseSelectedView;
                break;
        }
        if(this.getQuery()['f_id'])
            Component = FilteredSelectedView;
        return (<Component {...this.props} />)
    },

});


module.exports = ContactsSelectedView;
