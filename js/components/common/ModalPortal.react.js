var React = require('react');
var div = React.DOM.div;
var IconSvg = require('./IconSvg.react');
var cx        = React.addons.classSet;

var ModalPortal = React.createClass({

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
    },

    setFocusAfterRender: function(focus) {
        this.focusAfterRender = focus;
    },

    focusContent: function() {
        this.refs.content.getDOMNode().focus();
    },

    open: function() {
        this.setState({isOpen: true}, function() {

        }.bind(this));
    },

    close: function() {
        this.setState({isOpen: false}, function() {

        }.bind(this));
    },

    handleCloseClick: function() {
        if(this.ownerHandlesClose()) {
            this.props.onRequestClose();
        }
    },

    ownerHandlesClose: function() {
        return this.props.onRequestClose;
    },

    haveTobeClosed: function() {
        return !this.props.isOpen;
    },

    render: function() {
        className = cx({
            'modal': true,
            'open': this.props.isOpen
        });
        return this.haveTobeClosed() ? div() :  (
            <div>
                <div className={className}>
                    <div className="modal-header">
                        <button onClick={this.handleCloseClick} type="button" className="modal-close">
                            <IconSvg iconKey='close' />
                        </button>
                        {this.props.modalTitle}
                    </div>
                    <div ref='content' className="modal-body">
                        {this.props.children}
                    </div>
                </div>
                <div className="modal-backdrop"></div>
            </div>
        );
    }

});

module.exports = ModalPortal;
