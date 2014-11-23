/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var cx        = React.addons.classSet;
var Router = require('react-router');
var ActiveState = Router.ActiveState;
var Navigation = Router.Navigation;
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');
var ContactActionCreators = require('../../actions/ContactActionCreators');
var ShareStore = require('../../stores/ShareStore');
var ContactStore = require('../../stores/ContactStore');
var AppContextMixin = require('../../mixins/AppContextMixin');
var Form = require('../../forms/Form.react');
var inputs = require('../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Input = inputs.Input;
var Div = require('../../forms/Fieldset.react').Div;
var Crumb = require('../common/BreadCrumb.react').Crumb;

var SharedContactLink = React.createClass({
    mixins: [AppContextMixin, Router.State],

    statics: {
        getState: function() {
            return {
                'amount': ShareStore.size(),
                'hasNewItems': ShareStore.hasNew()
            }
        },
    },

    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return SharedContactLink.getState();
    },
    componentDidMount: function() {
        ShareStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ShareStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(SharedContactLink.getState());
    },
    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive(),
            'new': this.state.hasNewItems
        });
        return (
            <Link className={className} to='shared' onClick={this.onClick} >
                <div className="row-icon">
                    <IconSvg iconKey="inbox" />
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
        return route.name === 'shared' || route.name === 'shared_default';
    },
    onClick: function(evt) {
        // Do not prevent bubbling.
        if(this.state.hasNewItems) {
            ContactActionCreators.markAllSharesAsRead();
        }

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
            <Form onUpdate={this.onHandleUpdate} value={this.props.value} name='share:filter_contacts_form' ref='filter_contacts_form'>
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
                    </Div>
                    <div className="row-body-secondary">
                        <a onClick={this.props.onUserAction} href="#" className="text-secondary">Редактировать список</a>
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

var ShareListItem = React.createClass({
    mixins: [AppContextMixin],
    propTypes: {
        share: React.PropTypes.object,
        contact: React.PropTypes.object,
        is_selected: React.PropTypes.bool,
        onItemToggle: React.PropTypes.func
    },

    isNew: function() {
        return this.props.share.isNew;
    },

    getContactName: function() {
        return this.props.contact.fn;
    },
    getAuthorName: function() {
        // TODO: should get user from store
        return this.context.user.first_name;
    },
    getTimeAt: function() {
        return this.props.share.at
    },
    getNote: function() {
        return this.props.share.note
    },
    render: function() {
        var share = this.props.share;
        var classNames = cx({
            'stream-item': true,
            'new': this.isNew()
        });
        return (
            <div className={classNames}>
                <SVGCheckbox
                    name={'share__' + share.id}
                    label={this.getContactName()}
                    className='row'
                    value={this.props.is_selected}
                    onValueUpdate={this.props.onItemToggle.bind(null, share.id)} />
                <div className="stream-item-extra row">
                    <a href="#" className="row-icon">
                      <figure className="icon-userpic">
                        <img src="assets/img/userpics/sanzhar.png" alt="" />
                      </figure>
                    </a>
                    <div className="row-body">
                      <div className="text-caption text-secondary">
                        <a href="#" className="text-secondary">{this.getAuthorName()}</a> в {this.getTimeAt()}
                      </div>
                      <div className="row-body-message">
                        {this.getNote()}
                      </div>
                    </div>
                </div>
            </div>
        )
    }
});

var SharesList = React.createClass({
    propTypes: {
        filter_text: React.PropTypes.string,
        shares: React.PropTypes.array,
        contacts: React.PropTypes.array,
        selection_map: React.PropTypes.object,
        onChangeState: React.PropTypes.func
    },

    findContact: function(contact_id) {
        return _.find(this.props.contacts, function(contact){
            return contact.id === contact_id
        });
    },

    findShare: function(share_id) {
        return _.find(this.props.shares, function(share){
            return share.id === share_id
        });
    },

    onItemToggle: function(share_id, value) {
        var val = value['share__' + share_id];
        this.props.onChangeState(share_id, val)
    },

    getSelectedContacts: function() {
        var contact_ids = [];
        for(var share_id in this.props.selection_map) {
            var is_selected = this.props.selection_map[share_id];
            if(!is_selected) continue;
            contact_ids.push(this.findShare(share_id).contact_id);
        }
        return _.map(contact_ids, this.findContact);
    },

    filterShares: function() {
        // by all contacts and notes
        var shares = this.props.shares,
            filter_text = this.props.filter_text;
        if(!filter_text) {
            return shares;
        }
        var requiredShares = _.filter(shares, function(share) {
            var note = share.note.toLowerCase();
            return note.indexOf(filter_text.toLowerCase()) > - 1;
        });
        var notRequiredShares = _.difference(shares, requiredShares);
        _.forEach(notRequiredShares, function(s) {
            this.props.selection_map[s.id] = false;
        }.bind(this));
        return requiredShares;
    },

    render: function() {
        var self = this;
        var shareListItems = this.filterShares().map(function(share) {
            var is_selected = self.props.selection_map[share.id];
            return(
                <ShareListItem
                    key={'share__' + share.id}
                    share={share}
                    contact={self.findContact(share.contact_id)}
                    is_selected={is_selected}
                    onItemToggle={self.onItemToggle} />
            )
        });
        return (
            <div className="page-body">
                {shareListItems}
            </div>
        )
    }
});



var SharedContactDetailView = React.createClass({
    mixins: [Navigation],
    statics: {
        // willTransitionFrom: function(transition, component) {
        //     console.log(transition, component);
        //     console.log(transition, component);
        //     if (!confirm('You have unsaved information, are you sure you want to leave this page?')) {
        //         transition.abort();
        //     }
        // }
    },
    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        var shares = ShareStore.sortedByDate(true);
        var contacts = [], contact_ids = [], selection_map = {};
        contact_ids = shares.map(function(share){ return share.contact_id });
        contacts = ContactStore.getByIds(contact_ids);
        for(var i = 0; i<shares.length; i++) {
            selection_map[shares[i].id] = false;
        }

        return {
            shares: shares,
            contacts: contacts,
            selection_map: selection_map,
            search_bar: {select_all: false, filter_text: ''}
        }
    },
    getFilterText: function() {
        return this.state.search_bar.filter_text;
    },
    getShares: function() {
        return this.state.shares;
    },
    getContacts: function() {
        return this.state.contacts;
    },
    getSelectMap: function() {
        return this.state.selection_map;
    },
    getSharesNumber: function() {
        return this.getShares().length;
    },
    componentDidMount: function() {
        ShareStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(nextProps, nextState) {
        ShareStore.removeChangeListener(this._onChange);
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
    onChangeState: function(share_id, is_selected) {
        this.state.selection_map[share_id] = is_selected;
        this.setState(this.state);
    },

    render: function() {
        return (
            <div className="page">
                <div className="page-header">
                    <Crumb />
                    <FilterBar
                        ref='filter_bar'
                        value={this.state.search_bar}
                        onHandleUserInput={this.onHandleUserInput}
                        onUserAction={this.onUserAction} />
                </div>
                <SharesList
                    ref='share_list'
                    filter_text={this.getFilterText()}
                    shares={this.getShares()}
                    contacts={this.getContacts()}
                    selection_map={this.getSelectMap()}
                    onChangeState={this.onChangeState} />
            </div>
        )
    },
    onUserAction: function(evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.share_list.getSelectedContacts();
        if(_.size(selected_contacts) <= 0) {
            console.log('Choose at least one contact');
            return
        }
        var contact_ids = _.map(selected_contacts, function(c){ return c.id});
        if(contact_ids.length === 1) {
            this.transitionTo('share_contact_selected', {'id': contact_ids[0]});
        } else{
            this.transitionTo('share_contacts_selected', {'ids': contact_ids});
        }
    },
    _onChange: function() {
        this.setState(this.getInitialState());
    }
});



module.exports.DetailView = SharedContactDetailView;
module.exports.Link = SharedContactLink;
module.exports.SharesList = SharesList;
module.exports.FilterBar = FilterBar;
