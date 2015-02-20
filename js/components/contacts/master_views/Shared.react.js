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
var moment = require('moment');
var utils = require('../../../utils');
var IconSvg = require('../../common/IconSvg.react');
var ContactActionCreators = require('../../../actions/ContactActionCreators');
var ShareStore = require('../../../stores/ShareStore');
var ContactStore = require('../../../stores/ContactStore');
var UserStore = require('../../../stores/UserStore');
var AppContextMixin = require('../../../mixins/AppContextMixin');
var Form = require('../../../forms/Form.react');
var inputs = require('../../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Div = require('../../../forms/Fieldset.react').Div;
var Crumb = require('../../common/BreadCrumb.react').Crumb;
var CommonFilterBar = require('../FilterComposer.react').CommonFilterBar;

var URL_PREFIX   = require('../../../constants/CRMConstants').URL_PREFIX;

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
        ContactStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ShareStore.removeChangeListener(this._onChange);
        ContactStore.removeChangeListener(this._onChange);
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

var ShareListItem = React.createClass({
    mixins: [AppContextMixin],
    propTypes: {
        share: React.PropTypes.object,
        contact: React.PropTypes.object,
        is_selected: React.PropTypes.bool,
        onItemToggle: React.PropTypes.func
    },

    getAuthor: function(user_id) {
        return UserStore.get(user_id);
    },

    getContactName: function() {
        return this.props.contact.vcard.fn;
    },
    getAuthorName: function() {
        // TODO: should get user from store
        return this.getUser().vcard.fn;
    },
    getTimeAt: function() {
        return this.props.share.date_created
    },
    getNote: function() {
        return this.props.share.note
    },
    isFollowing: function(contact_id) {
        var user = this.getUser();
        if(_.contains(user.unfollow_list, contact_id))
            return <span className="badge-unfollowing">Not following</span>
        return <span className="badge-following">Following</span>
    },
    render: function() {
        var share = this.props.share,
            author = this.getAuthor(share.share_from);

        var classNames = cx({
            'stream-item': true,
            'new': !share.is_read,
        });
        return (
            <div className={classNames}>
                <SVGCheckbox
                    name={'share__' + share.contact}
                    label={this.getContactName()}
                    sublabel={this.isFollowing(share.contact)}
                    className='row'
                    value={this.props.is_selected}
                    onValueUpdate={this.props.onItemToggle.bind(null, share.contact)} />
                <div className="stream-item-extra row">
                    <a href="#" className="row-icon">
                      <figure className="icon-userpic">
                        <img src={URL_PREFIX + author.userpic} />
                      </figure>
                    </a>
                    <div className="row-body">
                      <div className="text-caption text-secondary">
                        <a href="#" className="text-secondary">{author.vcard.fn}</a> в {utils.formatTime(share)}
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
                return share.contact;
        }
        return null;
    },

    filterShares: function() {
        // by all contacts and notes
        var shares = _.sortBy(this.props.shares, function(s) { return moment(s.date_created); }).reverse(),
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
                    contact={self.findContact(share.contact)}
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
        willTransitionFrom: function (transition, component) {
            ContactActionCreators.markSharesAsRead(ShareStore.getNew());
        }
    },

    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        var shares = ShareStore.sortedByDate();
        var contacts = [], contact_ids = [], selection_map = {};
        contact_ids = shares.map(function(share){ return share.contact });
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
                return share.contact;
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
