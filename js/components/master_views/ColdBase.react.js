/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var cx        = React.addons.classSet;
var Router = require('react-router');
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');
var ContactActionCreators = require('../../actions/ContactActionCreators');
var ContactStore = require('../../stores/ContactStore');
var AppContextMixin = require('../../mixins/AppContextMixin');
var Form = require('../../forms/Form.react');
var inputs = require('../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Input = inputs.Input;
var Div = require('../../forms/Fieldset.react').Div;


function get_coldbase_contacts() {
    return _.size(ContactStore.getColdByDate());
}


var ColdBaseLink = React.createClass({
    mixins: [Router.ActiveState],
    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return {'amount': get_coldbase_contacts()};
    },

    componentDidMount: function() {
        ContactStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ContactStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({'amount': get_coldbase_contacts()});
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive()
        });
        return (
            <Link className={className} to='coldbase'>
                <div className="row-icon"></div>
                <div className="row-body">
                    <div className="row-body-primary">
                        {this.props.label}
                    </div>
                    <div className="row-body-secondary">
                      {this.state.amount}
                    </div>
                </div>
            </Link>
        )
    },
    isCurrentlyActive: function() {
        var routes = this.getActiveRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name === 'coldbase';
    }
});


var FilterBar = React.createClass({
    propTypes: {
        value: React.PropTypes.object,
        onUserAction: React.PropTypes.func,
        onHandleUserInput: React.PropTypes.func
    },
    render: function() {
        return (
            <Form onUpdate={this.onHandleUpdate} value={this.props.value} name='contact:filter_contacts_form' ref='filter_contacts_form'>
                <Div className="page-header-filterContainer">
                    <Div className="page-header-filter row">
                        <Div className="row-icon">
                            <IconSvg iconKey='search' />
                        </Div>
                        <Div className="row-body row-body--inverted">
                            <Div className="row-body-secondary">
                                <IconSvg iconKey='arrow-down' />
                            </Div>
                            <Div className="row-body-primary">
                                <Input name="filter_text" type="text" className="input-filter" placeholder="Фильтр" />
                            </Div>
                        </Div>
                    </Div>
                </Div>
                <Div className="page-header-controls row">
                    <Div className="row-body-primary">
                        <SVGCheckbox name="select_all" className="text-secondary" label="Выбрать все" />
                        <a onClick={this.props.onUserAction.bind(null, 'share')} href="" className="row--inline text-secondary">
                            <div className="row-icon">
                                <IconSvg iconKey='share' />
                            </div>
                            <div className="row-body">
                                Поделиться
                            </div>
                        </a>
                    </Div>
                    <div className="row-body-secondary">
                        <a onClick={this.props.onUserAction.bind(null, 'edit')} href="" className="text-secondary">Редактировать список</a>
                    </div>
                </Div>


            </Form>
        )
    },
    onHandleUpdate: function(value) {
        var form = this.refs.filter_contacts_form;
        var errors = form.validate();
        if(!errors) {
            this.props.onHandleUserInput(form.value());
        } else {
            alert(errors);
        }
    }

});


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

var ColdBaseList = React.createClass({
    propTypes: {
        filter_text: React.PropTypes.string,
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
            <div>
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
        var contactListItems = this.filterContacts().map(function(contact) {
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


var ColdBaseDetailView = React.createClass({
    propTypes: {
        label: React.PropTypes.string
    },
    getInitialState: function() {
        var selection_map = {};
        contacts = ContactStore.getColdByDate(true);
        for(var i = 0; i < contacts.length; i++) {
            selection_map[contacts[i].id] = false;
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
        <div className="page">
            <div className="page-header">
                <ul className="page-breadcrumbs">
                  <li><span className="page-breadcrumbs-link">{this.props.alt}</span></li>
                </ul>
                <FilterBar
                    ref="filter_bar"
                    value={this.state.search_bar}
                    onHandleUserInput={this.onHandleUserInput}
                    onUserAction={this.onUserAction} />
            </div>
            <ColdBaseList
                ref="coldbase_list"
                filter_text={this.getFilterText()}
                contacts={this.getContacts()}
                selection_map={this.getSelectMap()}
                onChangeState={this.onChangeState} />
        </div>
        )
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

module.exports.DetailView = ColdBaseDetailView;
module.exports.Link = ColdBaseLink;
