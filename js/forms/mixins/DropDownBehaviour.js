var ESCAPE_KEY_CODE = 27;

var DropDownBehaviour = {

    getInitialState: function() {
        return {
            isOpen: false
        }
    },

    componentWillReceiveProps: function(nextProps, nextState) {
        if(this.state.isOpen) {
            this.setState({isOpen: false});
        }
    },

    onMenuToggle: function(evt) {
        evt.preventDefault();
        this.setState({isOpen: !this.isOpen()}, function() {
            if(this.isOpen()) {
                this.refs.menuToggler.getDOMNode().focus();
            }
        });
    },

    onKeyDown: function(evt) {
      if(evt.keyCode == ESCAPE_KEY_CODE) {
        evt.preventDefault();
        this.setState({isOpen: false});
      }
    },

    onChoice: function(choice_idx) {
        var choice = this.props.choices[choice_idx];
        this.props.onChange(choice_idx, choice);
    },

    isOpen: function() {
        return this.state.isOpen;
    },

};

module.exports = DropDownBehaviour;
