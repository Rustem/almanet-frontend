var _ = require('lodash');
var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var master_views = require('./master_views');
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var ShareStore = require('../../stores/ShareStore');
var ContactStore = require('../../stores/ContactStore');
var BreadcrumbStore = require('../../stores/BreadcrumbStore');
var ActivityStore = require('../../stores/ActivityStore');
var ContactActionCreators = require('../../actions/ContactActionCreators');
var ActivityActionCreators = require('../../actions/ActivityActionCreators');
var UserActionCreators = require('../../actions/UserActionCreators');
var ContactVCard = require('../common/VCard.react').ContactVCard;
var BreadCrumb = require('../common/BreadCrumb.react');
var Crumb = require('../common/BreadCrumb.react').Crumb;
var IconSvg = require('../common/IconSvg.react');
var Modal = require('../common/Modal.react');
var AppContextMixin = require('../../mixins/AppContextMixin');
var AllBase = require('./master_views').AllBase;
var AddActivityForm = require('../../forms/AddActivityForm.react');
var ContactShareForm = require('../../forms/ContactShareForm.react');
var VIEW_MODE = require('../../constants/CRMConstants').CONTACT_VIEW_MODE;

var ACTIONS = keyMirror({
    NO_ACTION: null,
    ADD_EVENT: null,
    SHARE: null,
    EDIT: null,
    VIEW_PROFILE: null
})

var ControlBar = React.createClass({
    propTypes: {
        contact_id: React.PropTypes.string.isRequired,
        onUserAction: React.PropTypes.func
    },
    render: function() {
        return (
        <div className='js-contact-actions'>
        <a onClick={this.props.onUserAction.bind(null, ACTIONS.ADD_EVENT)} className="row row--oneliner row--link" href="#">
            <div className="row-icon text-good">
                <IconSvg iconKey='add' />
            </div>
            <div className="row-body">
              Добавить взаимодействие
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
        <Link to='contact_profile' params={{id: this.props.contact_id}} className="row row--oneliner row--link" href="#">
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

var SingleSelectedDetailView = React.createClass({
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
            <ControlBar contact_id={this.props.contact_id}
                        onUserAction={this.onUserAction} />
            <div className="space-vertical"></div>
            <ContactVCard onHandleSubmit={this.onContactUpdate}
                          contact={this.getContact()}
                          mode={this.getVCardMode()} />
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
                {this.render_body()}
                <Modal isOpen={this.getAddEventModalState()}
                       onRequestClose={this.resetState}
                       modalTitle='ДОБАВЛЕНИЕ СОБЫТИЯ'>
                    <AddActivityForm
                        contact_ids={[this.props.contact_id]}
                        current_user={this.getUser()}
                        onHandleSubmit={this.onAddEvent} />
                </Modal>
                <Modal isOpen={this.isShareFormActive()}
                   modalTitle='ПОДЕЛИТЬСЯ СПИСКОМ'
                   onRequestClose={this.resetState} >
                    <ContactShareForm
                        contact_ids={[this.props.contact_id]}
                        current_user={this.getUser()}
                        onHandleSubmit={this.onShareSubmit} />
                </Modal>
            </div>
        )
    },
});


module.exports = SingleSelectedDetailView;
