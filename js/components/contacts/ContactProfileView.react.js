var _ = require('lodash');

var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var cx            = React.addons.classSet;
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var ContactStore = require('../../stores/ContactStore');
var ShareStore = require('../../stores/ShareStore');
var SalesCycleStore = require('../../stores/SalesCycleStore');
var ProductStore = require('../../stores/ProductStore');
var ContactActionCreators = require('../../actions/ContactActionCreators');
var BreadCrumb = require('../common/BreadCrumb.react');
var IconSvg = require('../common/IconSvg.react');
var ContactVCard = require('../common/VCard.react').ContactVCard;
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var Modal = require('../common/Modal.react');
var DropDownBehaviour = require('../../forms/behaviours/DropDownBehaviour');
var ContactShareForm = require('../../forms/ContactShareForm.react');
var AppContextMixin = require('../../mixins/AppContextMixin');
var FollowButton = require('../common/FollowButton.react');

var VIEW_MODE = require('../../constants/CRMConstants').CONTACT_VIEW_MODE;

var ACTIONS = keyMirror({
    NO_ACTION: null,
    SHARE: null,
    EDIT: null,
});


var ContactDeleteButton = React.createClass({
    mixins: [Router.Navigation],
    propTypes: {
        contact: React.PropTypes.object.isRequired
    },

    onClick: function() {
        ContactActionCreators.delete(this.props.contact);
        this.transitionTo('contacts');
    },

    render: function() {
        return (
            <button className="btn btn--save" onClick={this.onClick}>Удалить</button>
        );
    }
});


var DropdownControlBar = React.createClass({

    mixins: [DropDownBehaviour],
    propTypes: {
        actionSelected: React.PropTypes.func.isRequired
    },

    renderChoice: function(choice, idx) {
        return (
            <li>
                <a key={'choice__' + idx} onClick={this.onChoice.bind(null, idx)} className="dropdown-menu-link">
                   {choice[1]}
                </a>
            </li>
        );
    },

    render: function() {
        var className = cx({
            'dropdown': true,
            'open': this.state.isOpen
        });
        return (
            <div className={className}>
                <button ref='menuToggler' type="button" className="row row--oneliner row--link"
                        onKeyDown={this.onKeyDown}
                        onClick={this.onMenuToggle}>
                    <div className="row-icon">
                        <IconSvg iconKey="more" />
                    </div>
                    <div className="row-body">
                        Опции
                    </div>
                </button>
                <div ref="menuBody" className="dropdown-menu">
                    <a href="#" onClick={this.props.actionSelected.bind(null, ACTIONS.SHARE)} className="row row--oneliner row--link">
                        <div className="row-icon text-good">
                            <IconSvg iconKey="share" />
                        </div>
                        <div className="row-body">
                          Поделиться
                        </div>
                    </a>
                    <a href="#" onClick={this.props.actionSelected.bind(null, ACTIONS.EDIT)} className="row row--oneliner row--link last">
                        <div className="row-icon text-good">
                            <IconSvg iconKey="edit" />
                        </div>
                        <div className="row-body">
                          Редактировать
                        </div>
                    </a>
                </div>

            </div>
        );
    }

});


var ContactProfileView = React.createClass({
    mixins: [AppContextMixin, Router.State],

    getInitialState: function() {
        return {action: ACTIONS.NO_ACTION};
    },

    componentDidMount: function() {
        ShareStore.addChangeListener(this.resetState);
        ContactStore.addChangeListener(this.resetState);
        SalesCycleStore.addChangeListener(this.resetState);
    },

    componentWillUnmount: function() {
        ShareStore.removeChangeListener(this.resetState);
        ContactStore.removeChangeListener(this.resetState);
        SalesCycleStore.removeChangeListener(this.resetState);
    },

    isShareFormActive: function() {
        return this.state.action === ACTIONS.SHARE;
    },

    getContact: function() {
        return ContactStore.get(this.getParams().id);
    },

    getVCardMode: function() {
        return this.state.action === ACTIONS.EDIT ? VIEW_MODE.EDIT : VIEW_MODE.READ;
    },

    getProducts: function() {
        var cid = this.getParams().id;
        return _.uniq(_.reduce(SalesCycleStore.getCyclesForContact(cid), function(rv, sc) {
                    rv.push(sc.product_ids);
                    return _.compact(_.flatten(rv));
                }, []));
    },

    onActionSelected: function(action_type, evt) {
        evt.preventDefault();
        this.setState({action: action_type});
        return false;
    },

    onContactUpdate: function(updContact) {
        var contact_id = this.getParams().id;
        ContactActionCreators.editContact(contact_id, updContact);
    },

    onShareSubmit: function(shares){
        ContactActionCreators.createShares(shares);
    },

    resetState: function() {
        this.setState({action: ACTIONS.NO_ACTION});
    },

    renderProduct: function(p_id) {
        return (
            <Link to="product_detail" params={{product_id: p_id}} className="text-secondary">
                {ProductStore.get(p_id).name}
            </Link>)
    },

    render: function() {
        var asideLink = (<a onClick={this.onActionSelected.bind(null, ACTIONS.EDIT)} href="#" className="text-secondary">Редактировать</a>);
        if(this.state.action === ACTIONS.EDIT) {
            asideLink = (<a onClick={function(evt) {
                evt.preventDefault();
                this.refs.vcard_widget.triggerSubmit();
                return false;
            }.bind(this)} href="#" className="text-good text-padLeft">Сохранить</a>)
        }
        var products = this.getProducts();
        return (
            <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page page--compact">
                        <div className="page-header">
                            <BreadCrumb slice={[1]} />
                        </div>
                        <div className="page-body">
                            <DropdownControlBar actionSelected={this.onActionSelected} />
                            <div className="space-vertical"></div>
                            <ContactVCard ref="vcard_widget" onHandleSubmit={this.onContactUpdate}
                              contact={this.getContact()}
                              mode={this.getVCardMode()} />
                            <div className="contact-aside">
                                {asideLink}
                            </div>
                            <div className="space-verticalBorder"></div>
                            <div className="text-strong text-large">Продукты</div>
                            {products.map(this.renderProduct)}

                            <div className="space-verticalBorder"></div>
                            <FollowButton contact={this.getContact()} />

                            <ContactDeleteButton contact={this.getContact()} />
                        </div>

                    </div>
                    <Modal isOpen={this.isShareFormActive()}
                            modalTitle='ПОДЕЛИТЬСЯ СПИСКОМ'
                            onRequestClose={this.resetState} >
                        <ContactShareForm
                            contact_ids={[this.getParams().id]}
                            current_user={this.getUser()}
                            onHandleSubmit={this.onShareSubmit}
                            onCancel={this.resetState} />
                    </Modal>
                </div>
                <div className="body-detail">
                    <RouteHandler />
                </div>
            </div>
            <Footer />
          </div>
        );
    }

});

module.exports = ContactProfileView;
