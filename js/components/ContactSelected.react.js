/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var master_views = require('./master_views');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var ShareStore = require('../stores/ShareStore');
var ContactStore = require('../stores/ContactStore');
var ActivityStore = require('../stores/ActivityStore');
var ContactActionCreators = require('../actions/ContactActionCreators');
var ActivityActionCreators = require('../actions/ActivityActionCreators');
var UserActionCreators = require('../actions/UserActionCreators');
var ContactVCard = require('./ContactVCard.react');
var BreadCrumb = require('./common/BreadCrumb.react');
var Crumb = require('./common/BreadCrumb.react').Crumb;
var IconSvg = require('./common/IconSvg.react');
var Modal = require('./common/Modal.react');
var AppContextMixin = require('../mixins/AppContextMixin');
var ColdBase = require('./master_views').ColdBase;
var AddActivityForm = require('../forms/AddActivityForm.react');
var ContactShareForm = require('../forms/ContactShareForm.react');
var VIEW_MODE = require('../constants/CRMConstants').CONTACT_VIEW_MODE;

var ACTIONS = keyMirror({
    NO_ACTION: null,
    ADD_EVENT: null,
    SHARE: null,
    EDIT: null,
    VIEW_PROFILE: null
})

var ControlBar = React.createClass({
    mixins : [Router.State],
    propTypes: {
        onUserAction: React.PropTypes.func
    },
    render: function() {
        return (
        <div class='js-contact-actions'>
        <a onClick={this.props.onUserAction.bind(null, ACTIONS.ADD_EVENT)} className="row row--oneliner row--link" href="#">
            <div className="row-icon text-good">
                <IconSvg iconKey='add' />
            </div>
            <div className="row-body">
              Добавить событие
            </div>
        </a>
        <a onClick={this.props.onUserAction.bind(null, ACTIONS.SHARE)} className="row row--oneliner row--link" href="#">
            <div className="row-icon">
                <IconSvg iconKey='share' />
            </div>
            <div className="row-body">
              Поделиться
            </div>
        </a>
        <a onClick={this.props.onUserAction.bind(null, ACTIONS.EDIT)} className="row row--oneliner row--link" href="#">
            <div className="row-icon">
                <IconSvg iconKey='edit' />
            </div>
            <div className="row-body">
              Редактировать
            </div>
        </a>
        <Link to='contact_profile' params={this.getParams()} className="row row--oneliner row--link" href="#">
            <div className="row-icon">
                <IconSvg iconKey='profile' />
            </div>
            <div className="row-body">
              Профиль
            </div>
        </Link>
        </div>
        )
    }

});

var ContactSelectedDetailView = React.createClass({
    mixins: [AppContextMixin],
    propTypes: {
        contact_id: React.PropTypes.string,
        onHandleEditContact: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            action: ACTIONS.NO_ACTION,
        }
    },

    getVCardMode: function() {
        return this.state.action === ACTIONS.EDIT ? VIEW_MODE.EDIT : VIEW_MODE.READ;
    },
    getAddEventModalState: function() {
        return this.state.action === ACTIONS.ADD_EVENT;
    },
    isShareFormActive: function() {
        return this.state.action === ACTIONS.SHARE;
    },
    componentDidMount: function() {
        ActivityStore.addChangeListener(this.resetState);
        ShareStore.addChangeListener(this.resetState);
        ContactStore.addChangeListener(this.resetState);
    },
    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this.resetState);
        ShareStore.removeChangeListener(this.resetState);
        ContactStore.removeChangeListener(this.resetState);
    },
    getContact: function() {
        return ContactStore.get(this.props.contact_id);
    },
    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        this.setState({action: actionType});
    },
    onContactUpdate: function() {
        // this.setState({mode: VIEW_MODE.READ});
        this.props.onHandleEditContact.apply(this, arguments)
    },
    onAddEvent: function(newEvent) {
        ActivityActionCreators.createActivity(newEvent);
    },

    onShareSubmit: function(shares){
        ContactActionCreators.createShares(shares);
    },

    resetState: function() {
        this.setState({action: ACTIONS.NO_ACTION});
    },

    render_body: function() {
        return (
            <div className="page-body">
            <ControlBar onUserAction={this.onUserAction} />
            <div className="space-vertical"></div>
            <ContactVCard onHandleSubmit={this.onContactUpdate}
                          contact={this.getContact()}
                          mode={this.getVCardMode()} />
            </div>
        )
    },

    render_empty_body: function() {
        return (
            <div className="page-body">
                <p>Пожалуйста выберите хотя бы одного контакта для дальнейшей
                работы</p>
            </div>
        )
    },
    render: function() {
        var contact = this.getContact();
        return (
            <div className="page page--compact">
                <div className="page-header">
                    <Crumb />
                </div>
                {contact && this.render_body() || this.render_empty_body()}
                <Modal isOpen={this.getAddEventModalState()}
                       onRequestClose={this.resetState}
                       modalTitle='ДОБАВЛЕНИЕ СОБЫТИЯ'>
                    <AddActivityForm
                        contact_ids={[this.props.contact_id]}
                        current_user={this.context.user}
                        onHandleSubmit={this.onAddEvent} />
                </Modal>
                <Modal isOpen={this.isShareFormActive()}
                   modalTitle='ПОДЕЛИТЬСЯ СПИСКОМ'
                   onRequestClose={this.resetState} >
                    <ContactShareForm
                        contact_ids={[this.props.contact_id]}
                        current_user={this.context.user}
                        onHandleSubmit={this.onShareSubmit} />
                </Modal>
            </div>
        )
    },

});


var ShareContactSelectedView = React.createClass({
    mixins : [Router.Navigation, Router.State],

    getInitialState: function() {
        var selection_map = {};
        var contacts = ContactStore.getByDate(true);
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
        if(n > 1) {
            this.transitionTo('contacts_selected', {'ids': cids});
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

    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.coldbase_list.getSelectedContacts();
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
        var contact_id = null;
        for(var cid in this.state.selection_map) {
            if(this.state.selection_map[cid] === true) {
                contact_id = cid;
                break;
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
                    <ContactSelectedDetailView
                        contact_id={contact_id}
                        onHandleEditContact={this.onHandleEditContact.bind(null, contact_id)} />
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


module.exports = ShareContactSelectedView;
