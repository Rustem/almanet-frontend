/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var Fuse = require('../libs/fuse');
var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var master_views = require('./master_views');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var ShareStore = require('../stores/ShareStore');
var ContactStore = require('../stores/ContactStore');
var BreadcrumbStore = require('../stores/BreadcrumbStore');
var ContactActionCreators = require('../actions/ContactActionCreators');
var UserActionCreators = require('../actions/UserActionCreators');
var ContactVCard = require('./ContactVCard.react');
var BreadCrumb = require('./common/BreadCrumb.react');
var Crumb = require('./common/BreadCrumb.react').Crumb;
var IconSvg = require('./common/IconSvg.react');
var AllBase = require('./master_views').AllBase;
var AppContextMixin = require('../mixins/AppContextMixin');
var Modal = require('./common/Modal.react');
var AddActivityForm = require('../forms/AddActivityForm.react');
var ContactShareForm = require('../forms/ContactShareForm.react');
var VIEW_MODE = require('../constants/CRMConstants').CONTACT_VIEW_MODE;

var ACTIONS = keyMirror({
    ADD_EVENT: null,
    SHARE: null
})

var ControlBar = React.createClass({
    propTypes: {
        onUserAction: React.PropTypes.func
    },
    render: function() {
        return (
        <div class='js-contact-actions'>
        <a onClick={this.props.onUserAction.bind(null, ACTIONS.ADD_EVENT)} className="row row--oneliner row--link">
            <div className="row-icon text-good">
                <IconSvg iconKey='add' />
            </div>
            <div className="row-body">
              Добавить событие
            </div>
        </a>
        <a onClick={this.props.onUserAction.bind(null, ACTIONS.SHARE)} className="row row--oneliner row--link">
            <div className="row-icon">
                <IconSvg iconKey='share' />
            </div>
            <div className="row-body">
              Поделиться
            </div>
        </a>
        </div>
        )
    }

});

var ContactsSelectedDetailView = React.createClass({
    mixins: [AppContextMixin],

    propTypes: {
        contact_ids: React.PropTypes.array,
        onHandleEditContact: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            action: ACTIONS.NO_ACTION,
        }
    },

    getContacts: function() {
        return _.map(this.props.contact_ids, ContactStore.get)
    },

    getAddEventModalState: function() {
        return this.state.action === ACTIONS.ADD_EVENT;
    },

    isShareFormActive: function() {
        return this.state.action === ACTIONS.SHARE;
    },

    componentDidMount: function() {
        ShareStore.addChangeListener(this.resetState);
        ContactStore.addChangeListener(this.resetState);
    },

    componentWillUnmount: function() {
        ShareStore.removeChangeListener(this.resetState);
        ContactStore.removeChangeListener(this.resetState);
    },

    onAddEvent: function(newEvent) {
        // this.setState({mode: VIEW_MODE.READ});
        console.log("ADd event", newEvent);
        this.resetState();
    },

    onShareSubmit: function(shares){
        ContactActionCreators.createShares(shares);
        // this.resetState();
    },

    onUserAction: function(actionType, evt) {
        this.setState({action: actionType});
    },

    resetState: function() {
        this.setState({action: ACTIONS.NO_ACTION});
    },

    render: function() {
        return (
            <div className="page page--compact">
                <div className="page-header">
                    <Crumb />
                </div>
                <div className="page-body">
                    <ControlBar onUserAction={this.onUserAction} />
                    <div className="space-vertical"></div>
                    <div className="inputLine">
                        <strong>{this.props.contact_ids.length} контакта</strong>
                    </div>
                </div>
                <Modal isOpen={this.getAddEventModalState()}
                       onRequestClose={this.resetState}
                       modalTitle='ДОБАВЛЕНИЕ СОБЫТИЯ'>
                    <AddActivityForm
                        contact_ids={this.props.contact_ids}
                        current_user={this.context.user}
                        onHandleSubmit={this.onAddEvent} />
                </Modal>
                <Modal isOpen={this.isShareFormActive()}
                   modalTitle='ПОДЕЛИТЬСЯ СПИСКОМ'
                   onRequestClose={this.resetState} >
                    <ContactShareForm
                        contact_ids={this.props.contact_ids}
                        current_user={this.context.user}
                        onHandleSubmit={this.onShareSubmit} />
                </Modal>
            </div>
        )
    },

});


var ShareContactsSelectedView = React.createClass({
    mixins : [Router.Navigation, Router.State],

    getInitialState: function() {
        var selection_map = {};
        var contacts = ContactStore.getByDate(true);
        var selected_ids = this.getParams().ids;
        var cnt = 0;
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
            if(selected_ids.indexOf(contacts[i].id) > -1) {
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

    componentDidUpdate: function(prevProps, prevState) {
        var ids = [], n = 0;
        for(var contact_id in this.state.selection_map) {
            var is_selected = this.state.selection_map[contact_id];
            if(is_selected) {
                ids.push(contact_id);
                n += 1;
            }
        }
        if(n === 0) {
            var route = BreadcrumbStore.prev();
            this.transitionTo(route.name, route.params, route.query);
        } else if(n === 1) {
            this.transitionTo('contact_selected', {'id': ids[0]});
        } else {
            this.transitionTo('contacts_selected', {'ids': ids});
        }
        return n > 1;
    },

    search: function(search_str, collection) {
        var options = {
            keys: ['fn'],
        }
        var f = new Fuse(collection, options);
        return f.search(search_str)
    },

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all;
        var contacts = ContactStore.getByDate(true);
        if(value.filter_text) {
            contacts = this.search(value.filter_text, contacts);
        }
        console.log(changed, "hi", value.select_all, this.state.search_bar.select_all);
        for(var contact_id in this.state.selection_map) {
            if(changed === 1) {
                _map[contact_id] = value.select_all;
            } else {
                _map[contact_id] = this.state.selection_map[contact_id];
            }
        }
        console.log(_map);
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

    render: function() {
        var contact_ids = [];
        var select_map = this.getSelectMap();
        for(var i = 0; i<this.state.contacts.length; i++) {
            var c = this.state.contacts[i];
            if(select_map[c.id] === true) {
                contact_ids.push(c.id);
            }
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
                    <ContactsSelectedDetailView contact_ids={contact_ids} />
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


module.exports = ShareContactsSelectedView;
