var React = require('react/addons');
var cx        = React.addons.classSet;
var ModalPortal = require('./ModalPortal.react');


/**
<Modal onRequestClose={...} isOpen={true}>
    <form>
        ...
    </form>
</Modal>
*/

var Modal = React.createClass({

    propTypes: {
        isOpen: React.PropTypes.bool.isRequired,
        modalTitle: React.PropTypes.string.isRequired,
        onRequestClose: React.PropTypes.func
    },

    componentDidMount: function() {
        this.node = document.createElement('div');
        this.node.className = 'AlmanetModal';
        document.body.appendChild(this.node);
        this.renderModal(this.props)
    },

    componentWillReceiveProps: function(newProps) {
        this.renderModal(newProps)
    },

    componentWillUnmount: function() {
        React.unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
    },

    renderModal: function(props) {
        sanitizeProps(props);
        if(this.modal) {
            this.modal.setProps(props);
        } else {
            this.modal = React.render(ModalPortal(props), this.node);
        }
    },
    render: function() {
        return null;
    }
});

function sanitizeProps(props) {
  delete props.ref;
}

module.exports = Modal;
