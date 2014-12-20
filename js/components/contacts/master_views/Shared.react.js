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
var IconSvg = require('../../common/IconSvg.react');
var ContactActionCreators = require('../../../actions/ContactActionCreators');
var ShareStore = require('../../../stores/ShareStore');
var ContactStore = require('../../../stores/ContactStore');
var UserStore = require('../../../stores/UserStore');
var AppContextMixin = require('../../../mixins/AppContextMixin');
var Form = require('../../../forms/Form.react');
var inputs = require('../../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Input = inputs.Input;
var Div = require('../../../forms/Fieldset.react').Div;
var Crumb = require('../../common/BreadCrumb.react').Crumb;

var SharedContactLink = React.createClass({
    mixins: [AppContextMixin, Router.State],

    statics: {
        getState: function() {
            return {
                'amount': ShareStore.size(),
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
            'new': ShareStore.hasNew()
        });
        return (
            <Link className={className} to='shared'>
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
                        <a onClick={this.props.onUserAction.bind(null, 'edit')} href="#" className="text-secondary">Редактировать</a>
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

    getAuthor: function(user_id) {
        return UserStore.get(user_id);
    },

    getContactName: function() {
        return this.props.contact.fn;
    },
    getAuthorName: function() {
        // TODO: should get user from store
        return this.getUser().first_name;
    },
    getTimeAt: function() {
        return this.props.share.at
    },
    getNote: function() {
        return this.props.share.note
    },
    render: function() {
        var share = this.props.share,
            author = this.getAuthor(share.user_id);

        var classNames = cx({
            'stream-item': true,
            'new': this.isNew()
        });
        return (
            <div className={classNames}>
                <SVGCheckbox
                    name={'share__' + share.contact_id}
                    label={this.getContactName()}
                    className='row'
                    value={this.props.is_selected}
                    onValueUpdate={this.props.onItemToggle.bind(null, share.contact_id)} />
                <div className="stream-item-extra row">
                    <a href="#" className="row-icon">
                      <figure className="icon-userpic">
                        <img src={"img/userpics/" + author.userpic} />
                      </figure>
                    </a>
                    <div className="row-body">
                      <div className="text-caption text-secondary">
                        <a href="#" className="text-secondary">{author.first_name}</a>
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
            // console.log(contact.id, contact_id, contact);
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
        for(var contact_id in this.props.selection_map) {
            if(this.props.selection_map[contact_id]) {
                contact_ids.push(contact_id);
            }
        }
        return _.map(contact_ids, this.findContact);
    },

    getContactId: function(share_id) {
        for(var i = 0; i<this.props.shares.length; i++) {
            var share = this.props.shares[i];
            if(share.id === share_id)
                return share.contact_id;
        }
        return null;
    },

    filterShares: function() {
        // by all contacts and notes
        var shares = _.sortBy(this.props.shares, 'at').reverse(),
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
            this.props.selection_map[this.getContactId(s.id)] = false;
        }.bind(this));
        return requiredShares;
    },

    render: function() {
        var self = this;
        var shareListItems = this.filterShares().map(function(share) {
            var is_selected = self.props.selection_map[self.getContactId(share.id)];
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
    mixins: [Router.Navigation],
    statics: {

    },
    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        var shares = ShareStore.sortedByDate(true);
        var contacts = [], contact_ids = [], selection_map = {};
        contact_ids = shares.map(function(share){ return share.contact_id });
        contacts = ContactStore.getByIds(contact_ids);
        for(var i = 0; i<contacts.length; i++) {
            selection_map[contacts[i].id] = false;
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

    getContactId: function(share_id) {
        for(var i = 0; i<this.state.shares.length; i++) {
            var share = this.state.shares[i];
            if(share.id === share_id)
                return share.contact_id;
        }
        return null;
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

        var cur_ids = getSelectedList.call(this, cur_map),
            next_ids = getSelectedList.call(this, next_map);

        if(_.isEmpty(next_ids)) {
            return;
        }
        if(_.difference(cur_ids, next_ids).length === 0) {
            if(_.difference(next_ids, cur_ids).length === 0) {
                return;
            }
        }
        setTimeout(function() {
            this.transitionTo('contacts_selected', {'menu': 'shared'}, {'ids': next_ids});
        }.bind(this), 0);

    },

    onFilterBarUpdate: function(value) {
        var is_selected = value.select_all;
        var _map = {};
        for(var contact_id in this.state.selection_map) {
            _map[contact_id] = is_selected;
        }
        var newState = React.addons.update(this.state, {
            selection_map: {$set: _map},
            search_bar: {$set: value}
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

    render: function() {
        if(ShareStore.hasNew()) {
            setTimeout(function() {
                ContactActionCreators.markAllSharesAsRead(ShareStore.getAllNew());
            }.bind(this), 0);
        }
        return (
            <div className="page">
                <div className="page-header">
                    <Crumb />
                    <FilterBar
                        ref='filter_bar'
                        value={this.state.search_bar}
                        onHandleUserInput={this.onFilterBarUpdate}
                        onUserAction={this.onUserAction} />
                </div>
                <SharesList
                    ref='share_list'
                    filter_text={this.getFilterText()}
                    shares={this.getShares()}
                    contacts={this.getContacts()}
                    selection_map={this.getSelectMap()}
                    onChangeState={this.onToggleListItem} />
            </div>
        )
    },
    onUserAction: function(actionType, evt) {
        evt.preventDefault();
        var selected_contacts = this.refs.share_list.getSelectedContacts();
        if(_.size(selected_contacts) <= 0) {
            console.log('Choose at least one contact');
            return
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
