var React = require('react');
var keyMirror = require('react/lib/keyMirror');
var cx            = React.addons.classSet;
var Router = require('react-router');
var ContactStore = require('../stores/ContactStore');
var ContactActionCreators = require('../actions/ContactActionCreators');
var BreadCrumb = require('./common/BreadCrumb.react');
var IconSvg = require('./common/IconSvg.react');
var ContactVCard = require('./ContactVCard.react');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var DropDownBehaviour = require('../forms/behaviours/DropDownBehaviour');
var VIEW_MODE = require('../constants/CRMConstants').CONTACT_VIEW_MODE;



var ACTIONS = keyMirror({
    NO_ACTION: null,
    SHARE: null,
    EDIT: null,
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
                <button ref='menuToggler' onKeyDown={this.onKeyDown} onClick={this.onMenuToggle} type="button" className="row row--oneliner row--link">
                    <div className="row-icon">
                        <IconSvg iconKey="more" />
                    </div>
                    <div className="row-body">
                        Опции
                    </div>
                </button>
                <div className="dropdown-menu">
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
    mixins: [Router.State],

    getInitialState: function() {
        return {action: ACTIONS.NO_ACTION};
    },

    componentDidMount: function() {
        ContactStore.addChangeListener(this.resetState);
    },

    componentWillUnmount: function() {
        ContactStore.removeChangeListener(this.resetState);
    },

    getContact: function() {
        return ContactStore.get(this.getParams().id);
    },

    getVCardMode: function() {
        return this.state.action === ACTIONS.EDIT ? VIEW_MODE.EDIT : VIEW_MODE.READ;
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

    resetState: function() {
        this.setState({action: ACTIONS.NO_ACTION});
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
        console.log(this.getContact());
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
                        </div>

                    </div>
                </div>
                <div className="body-detail">

                </div>
            </div>
            <Footer />
          </div>
        );
    }

});

module.exports = ContactProfileView;
