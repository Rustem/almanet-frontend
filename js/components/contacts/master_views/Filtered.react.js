/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var Fuse = require('../../../libs/fuse');
var React = require('react/addons');
var cx        = React.addons.classSet;
var Router = require('react-router');
var capitalize = require('../../../utils').capitalize;
var fuzzySearch = require('../../../utils').fuzzySearch;
var IconSvg = require('../../common/IconSvg.react');
var Modal = require('../../common/Modal.react');
var FilterActionCreators = require('../../../actions/FilterActionCreators');
var ContactStore = require('../../../stores/ContactStore');
var ShareStore = require('../../../stores/ShareStore');
var FilterStore = require('../../../stores/FilterStore');
var AppContextMixin = require('../../../mixins/AppContextMixin');
var ContactShareForm = require('../../../forms/ContactShareForm.react');
var inputs = require('../../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Crumb = require('../../common/BreadCrumb.react').Crumb;
var CommonFilterBar = require('../FilterComposer.react').CommonFilterBar;
var FilterForm = require('../../../forms/FilterForm.react');

function get_contacts_number() {
    return _.size(ContactStore.getByDate());
}

var ContactListItem = React.createClass({
    mixins: [AppContextMixin],
    propTypes: {
        contact: React.PropTypes.object,
        is_selected: React.PropTypes.bool,
        onItemToggle: React.PropTypes.func
    },

    getContactName: function() {
        return this.props.contact.fn;
    },
    render: function() {
        var contact = this.props.contact;
        return (
            <SVGCheckbox
                name={'contact__' + contact.id}
                label={this.getContactName()}
                className='row row--oneliner'
                value={this.props.is_selected}
                onValueUpdate={this.props.onItemToggle.bind(null, contact.id)} />
        )
    }
});

var FilteredList = React.createClass({
    propTypes: {
        contacts: React.PropTypes.array,
        selection_map: React.PropTypes.object,
        onChangeState: React.PropTypes.func
    },

    findContact: function(contact_id) {
        return _.find(this.props.contacts, function(contact){
            return contact.id === contact_id
        });
    },

    onItemToggle: function(contact_id, value) {
        var val = value['contact__' + contact_id];
        this.props.onChangeState(contact_id, val)
    },

    getSelectedContacts: function() {
        var contact_ids = [];
        for(var contact_id in this.props.selection_map) {
            if(this.props.selection_map[contact_id]) {
                contact_ids.push(contact_id);
            }
        }
        return _.map(contact_ids, this.findContact);
    },

    filterContacts: function() {
        // by all contacts and notes
        var contacts = this.props.contacts,
            filter_text = this.props.filter_text;

        var filterContact = function(contact) {
            var fn = contact.fn.toLowerCase();
            return fn.indexOf(filter_text.toLowerCase()) > -1;
        }.bind(this);

        var sortBy = function(contact) {
            return contact.fn.toLowerCase();
        }.bind(this);

        contacts = _.sortBy(contacts, sortBy);
        if(!filter_text) {
            return contacts;
        }
        var requiredContacts = _.filter(contacts, filterContact);
        var notRequiredContacts = _.difference(contacts, requiredContacts);
        _.forEach(notRequiredContacts, function(c) {
            this.props.selection_map[c.id] = false;
        }.bind(this));
        return requiredContacts;
    },

    renderGroup: function(letter) {
        return (
            <div key={'group__' + letter}>
                <div className="space-vertical"></div>
                <div className="row row--oneliner row--letter">
                    <div className="row-icon">
                        {letter.toUpperCase()}
                    </div>
                </div>
            </div>
        )
    },

    render: function() {
        var prevContact = null;
        var contactListItems = this.props.contacts.map(function(contact) {
            var GroupContent = null;
            if(prevContact == null || prevContact.fn[0] !== contact.fn[0] ) {
                GroupContent = this.renderGroup(contact.fn[0]);
            }
            var is_selected = this.props.selection_map[contact.id];
            prevContact = contact;
            return(
                <div>
                {GroupContent ? GroupContent : null}
                <ContactListItem
                    key={'contact__' + contact.id}
                    contact={contact}
                    is_selected={is_selected}
                    onItemToggle={this.onItemToggle} />
                </div>
            )
        }.bind(this));

        return (
            <div className="page-body">
                {contactListItems}
            </div>
        )
    }
});

var FilteredViewMixin = {

    getInitialState: function() {
        var selection_map = {}, filter = this.getFilter(),
            contacts = this.applyFilter(filter);
        for(var i = 0; i < contacts.length; i++) {
            selection_map[contacts[i].id] = false;
        }
        return {
            contacts: contacts,
            selection_map: selection_map,
            search_bar: {select_all: false, filter_text: filter && filter.filter_text || ''},
            action: null
        }
    },

    getDefaultContacts: function() {
        var filter = this.getFilter();
        if(!filter)
            return [];
        switch(filter.base) {
            case 'all':
                return ContactStore.getByDate(true);
            case 'recent':
                return ContactStore.getRecent();
            case 'cold':
                return ContactStore.getColdByDate(true);
            case 'lead':
                return ContactStore.getLeads(true);
        }
    },

    getContacts: function() {
        return this.state.contacts;
    },

    getSelectMap: function() {
        return this.state.selection_map;
    },

    getFilter: function() {
        var f_id = this.getParams().id;
        return FilterStore.get(f_id);
    },

    getSelectedContacts: function() {
        var select_map = this.getSelectMap(),
            rv = [];
        for(var cid in select_map) {
            var is_sel = select_map[cid];
            if(is_sel) {
                rv.push(cid);
            }
        }
        return rv;
    },

    componentDidMount: function() {
        ShareStore.addChangeListener(this._onChange);
        ContactStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(nextProps, nextState) {
        ShareStore.removeChangeListener(this._onChange);
        ContactStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function(prevProps, prevState) {
        var cur_map = prevState.selection_map,
            next_map = this.state.selection_map;

        function getSelectedList(map) {
            var rv = [];
            for(var _id in map) {
                if(map[_id] === true) {
                    rv.push(_id);
                }
            }
            return rv;
        }

        var f_id = this.getParams().id;

        var cur_ids = getSelectedList(cur_map),
            next_ids = getSelectedList(next_map);

        if(_.isEmpty(next_ids)) {
            return;
        }
        if(_.difference(cur_ids, next_ids).length === 0) {
            if(_.difference(next_ids, cur_ids).length === 0) {
                return;
            }
        }
        setTimeout(function() {
            this.transitionTo('contacts_selected', {'menu': 'allbase'}, {'ids': next_ids, 'f_id': f_id});
        }.bind(this), 0);

    },

    isShareFormActive: function() {
        return this.state.action === 'share'
    },

    applyFilter: function(value) {
        if(!value)
            return [];
        var contacts = this.getDefaultContacts();
        if(value.filter_text)
            contacts = fuzzySearch(contacts, value.filter_text, {
                'keys': ['fn', 'emails.value']});
        return contacts;
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

    onToggleListItem: function(contact_id, is_selected) {
        var updItem = {};
        updItem[contact_id] = is_selected;
        var newState = React.addons.update(this.state, {
            selection_map: {$merge: updItem}
        });
        this.setState(newState);
    },

    resetActions: function() {
        this.state.action = null;
        this.setState(this.state);
    },

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var actionHandler = 'on' + _.capitalize(actionType);
        if(!(actionHandler in this) || !_.isFunction(this[actionHandler])){
            console.log('handler is not registered for this event')
            return;
        }
        this[actionHandler].call(this)
    },

    onShare: function() {
        this.setState({action: 'share'});
    },

    onShareSubmit: function(shares) {
        ContactActionCreators.createShares(shares);
        // action creator for share
    },



    onEdit: function() {
        var contact_ids = this.getSelectedContacts();
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    }
}

var FilteredDetailView = React.createClass({
    mixins: [AppContextMixin, Router.State, Router.Navigation, FilteredViewMixin],

    render: function() {
        var cids = this.getSelectedContacts();
        return (
        <div className="page">
            <div className="page-header">
                <Crumb />
                <CommonFilterBar
                    ref="filter_bar"
                    value={this.state.search_bar}
                    onHandleUserInput={this.onFilterBarUpdate}
                    onUserAction={this.onUserAction} />
            </div>
            <FilteredList
                ref="filtered_list"
                contacts={this.getContacts()}
                selection_map={this.getSelectMap()}
                onChangeState={this.onToggleListItem} />
            <Modal isOpen={this.isShareFormActive()}
                   modalTitle='ПОДЕЛИТЬСЯ СПИСКОМ'
                   onRequestClose={this.resetActions} >
                <ContactShareForm
                    contact_ids={cids}
                    current_user={this.getUser()}
                    onHandleSubmit={this.onShareSubmit} />
            </Modal>
        </div>
        )
    },
});

var FilteredNewView = React.createClass({
    mixins: [AppContextMixin, Router.State, FilteredViewMixin],

    onHandleSubmit: function(filterObject) {
        FilterActionCreators.create(filterObject);
    },

    render: function() {
        var cids = this.getSelectedContacts();
        return (
        <div className="page">
            <div className="page-header">
                <Crumb />
                <FilterForm
                    ref="filter_bar"
                    onHandleUserInput={this.onFilterBarUpdate}
                    onUserAction={this.onUserAction} 
                    onHandleSubmit={this.onHandleSubmit} />
            </div>
        </div>
        )
    },
});

var FilteredEditView = React.createClass({
    mixins: [AppContextMixin, Router.State, FilteredViewMixin],

    onHandleSubmit: function(filterObject) {
        FilterActionCreators.edit(filterObject);
    },

    render: function() {
        var cids = this.getSelectedContacts();
        return (
        <div className="page">
            <div className="page-header">
                <Crumb />
                <FilterForm
                    ref="filter_bar"
                    value={this.getFilter()}
                    onHandleUserInput={this.onFilterBarUpdate}
                    onUserAction={this.onUserAction} 
                    onHandleSubmit={this.onHandleSubmit} />
            </div>
        </div>
        )
    },
});

module.exports.DetailView = FilteredDetailView;
module.exports.NewView = FilteredNewView;
module.exports.EditView = FilteredEditView;
module.exports.FilteredList = FilteredList;
