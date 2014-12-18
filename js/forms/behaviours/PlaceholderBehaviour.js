var ESCAPE_KEY_CODE = 27;

var PlaceholderBehaviour = {

    getInitialState: function() {
        return {
            isClicked: false,
            isTyped: false,
            placeholder: this.value() || this.props.placeholder || ''
        }
    },

    componentDidMount: function() {
        this.getDOMNode().innerText = this.placeholder();
    },

    componentDidUpdate: function() {
        if(!this.isTyped()) {
                this.getDOMNode().innerText = this.placeholder();
        }
    },

    onFocus: function() {
        if(!this.isClicked()) {
            this.setState({isClicked: true});
            this.forceUpdate();
        }
    },

    onBlur: function() {
        if(this.isClicked() && !this.isTyped()) {
            this.getDOMNode().innerText = this.placeholder();
        }
        this.emitChange();
    },

    onKeyDown: function(evt) {
      if(evt.keyCode == ESCAPE_KEY_CODE) {
        // evt.preventDefault();
        // this.setState({isClicked: false});
      } else {
        if(!this.isClicked()) {
            this.setState({isTyped: true});
            this.forceUpdate();
        }
      }
    },

    isClicked: function() {
        return this.state.isClicked;
    },

    isTyped: function() {
        return this.state.isTyped;
    },

    placeholder: function() {
        return this.state.placeholder;
    },

};

module.exports = PlaceholderBehaviour;
