var React = require('react');
var ReactInstanceHandles = require("react/lib/ReactInstanceHandles");
var div = React.DOM.div;
var IconSvg = require('./IconSvg.react');
var cx        = React.addons.classSet;

ESCAPE_KEY = 27;

var ModalPortal = React.createClass({
    getInitialState: function() {
        return {
            isOpen: this.props.isOpen
        }
    },

    componentDidMount: function() {
        if(this.props.isOpen){
            this.setFocusAfterRender(true);
            this.open();
        }
    },

    componentWillReceiveProps: function(newProps) {
        if(!this.props.isOpen && newProps.isOpen) {
            this.setFocusAfterRender(true);
        }
        if(newProps.isOpen === true) {
            this.open();
        } else {
            this.close();
        }
    },

    componentDidUpdate: function() {
        if(this.focusAfterRender) {
            this.focusContent();
            this.setFocusAfterRender(false);
        }

        if( this.state.isOpen ) {
            window.addEventListener('click', this.handleClick);
        } else {
            window.removeEventListener('click', this.handleClick);
        }
    },

    setFocusAfterRender: function(focus) {
        this.focusAfterRender = focus;
    },

    focusContent: function() {
        this.refs.cancel_btn.getDOMNode().focus();
    },

    open: function() {
        this.setState({isOpen: true}, function() {

        }.bind(this));
    },

    close: function() {
        this.setState({isOpen: false}, function() {

        }.bind(this));
    },

    handleClick: function(evt) {
        if (ReactInstanceHandles.isAncestorIDOf(
                this.refs.modalBackdrop.getDOMNode().dataset.reactid,
                evt.target.dataset.reactid
                )) {
            this.close();
        }
    },

    handleCloseClick: function() {
        if(this.ownerHandlesClose()) {
            this.props.onRequestClose();
        }
    },

    handleKeyUp: function(evt) {
        if(evt.which === ESCAPE_KEY) {
            this.close();
        }
    },

    ownerHandlesClose: function() {
        return this.props.onRequestClose;
    },

    haveTobeClosed: function() {
        return !this.state.isOpen;
    },

    render: function() {
        className = cx({
            'modal': true,
            'open': true
        });
        return this.haveTobeClosed() ? div() :  (
            <div>
                <div className={className}>
                    <div className="modal-header">
                        <button ref="cancel_btn" type="button" className="modal-close"
                                onKeyDown={this.handleKeyUp}
                                onClick={this.handleCloseClick}>
                            <IconSvg iconKey='close' />
                        </button>
                        {this.props.modalTitle}
                    </div>
                    <div ref='content' className="modal-body" onKeyDown={this.handleKeyUp}>
                        {this.props.children}
                    </div>
                </div>
                <div ref='modalBackdrop' className="modal-backdrop"></div>
            </div>
        );
    }

});

module.exports = ModalPortal;
