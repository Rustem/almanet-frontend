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
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../../common/IconSvg.react');
var AppContextMixin = require('../../../mixins/AppContextMixin');
var ActivityStore = require('../../../stores/ActivityStore');
var ContactStore = require('../../../stores/ContactStore');
var ShareStore = require('../../../stores/ShareStore');
var Form = require('../../../forms/Form.react');
var inputs = require('../../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Input = inputs.Input;
var Div = require('../../../forms/Fieldset.react').Div;
var Crumb = require('../../common/BreadCrumb.react').Crumb;

function get_activity_number(user) {
    return _.size(ActivityStore.myFeed(user));
}


var MyFeedLink = React.createClass({
    mixins: [Router.State, AppContextMixin],
    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return {'amount': get_activity_number(this.getUser())};
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({'amount': get_activity_number(this.getUser())});
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive()
        });
        return (
            <Link className={className} to='my_feed'>
                <div className="row-icon">
                    <IconSvg iconKey="timeline" />
                </div>
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
        var routes = this.getRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name === 'my_feed';
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
                        <a onClick={this.props.onUserAction.bind(null, 'edit')} href="" className="text-secondary">Редактировать</a>
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

var MyFeedList = React.createClass({
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


var MyFeedDetailView = React.createClass({
    mixins: [AppContextMixin, Router.Navigation],
    propTypes: {
        label: React.PropTypes.string
    },
    getInitialState: function() {
        var selection_map = {};
        contacts = ContactStore.getByDate(true);
        for(var i = 0; i < contacts.length; i++) {
            selection_map[contacts[i].id] = false;
        }
        return {
            contacts: contacts,
            selection_map: selection_map,
            search_bar: {select_all: false, filter_text: ''},
            action: null
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
            this.transitionTo('contacts_selected', {}, {'ids': next_ids});
        }.bind(this), 0);

    },

    isShareFormActive: function() {
        return this.state.action === 'share'
    },

    onFilterBarUpdate: function(value) {
        var _map = {}, changed = value.select_all ^ this.state.search_bar.select_all,
            contacts = null;
        if(value.filter_text) {
            contacts = fuzzySearch(this.state.contacts, value.filter_text, {
                'keys': ['fn', 'emails.value']});
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

    resetActions: function() {
        this.state.action = null;
        this.setState(this.state);
    },

    render: function() {
        var cids = this.getSelectedContacts();

        return (
            <div className="page page--noHeaderOpts">
                <div className="page-header">
                    <h1>MyFeed</h1>
                </div>
                <div className="page-body">
                    <h4>MyFeed</h4>
                </div>
            </div>
        )
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
});

module.exports.DetailView = MyFeedDetailView;
module.exports.Link = MyFeedLink;
module.exports.FilterBar = FilterBar;
module.exports.MyFeedList = MyFeedList;
