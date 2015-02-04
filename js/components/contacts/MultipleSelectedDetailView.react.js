var _ = require('lodash');
var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var master_views = require('./master_views');
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var ShareStore = require('../../stores/ShareStore');
var ContactStore = require('../../stores/ContactStore');
var BreadcrumbStore = require('../../stores/BreadcrumbStore');
var ContactActionCreators = require('../../actions/ContactActionCreators');
var ActivityActionCreators = require('../../actions/ActivityActionCreators');
var UserActionCreators = require('../../actions/UserActionCreators');
var BreadCrumb = require('../common/BreadCrumb.react');
var Crumb = require('../common/BreadCrumb.react').Crumb;
var IconSvg = require('../common/IconSvg.react');
var AllBase = require('./master_views').AllBase;
var AppContextMixin = require('../../mixins/AppContextMixin');
var Modal = require('../common/Modal.react');
var AddActivityForm = require('../../forms/AddActivityForm.react');
var ContactShareForm = require('../../forms/ContactShareForm.react');
var VIEW_MODE = require('../../constants/CRMConstants').CONTACT_VIEW_MODE;

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
        <div className='js-contact-actions'>
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



var MultipleSelectedDetailView = React.createClass({
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
        this.resetState();
        ActivityActionCreators.createActivity(newEvent);
    },

    onShareSubmit: function(shares){
        this.resetState();
        ContactActionCreators.createShares(shares);
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
                       modalTitle='ДОБАВЛЕНИЕ ВЗАИМОДЕЙСТВИЯ'>
                    <AddActivityForm
                        contact_ids={this.props.contact_ids}
                        current_user={this.getUser()}
                        onHandleSubmit={this.onAddEvent} 
                        onCancel={this.resetState} />
                </Modal>
                <Modal isOpen={this.isShareFormActive()}
                   modalTitle='ПОДЕЛИТЬСЯ СПИСКОМ'
                   onRequestClose={this.resetState} >
                    <ContactShareForm
                        contact_ids={this.props.contact_ids}
                        current_user={this.getUser()}
                        onHandleSubmit={this.onShareSubmit}
                        onCancel={this.resetState} />
                </Modal>
            </div>
        )
    },

});


module.exports = MultipleSelectedDetailView;
