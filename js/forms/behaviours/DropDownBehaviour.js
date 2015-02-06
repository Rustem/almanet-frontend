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

    onMenuTogglerBlur: function(evt) {
        // to fix problem when DropDown doesn't close on blur
        // there is setTimeout, because Blur happens first than Click on the Menu
        setTimeout(
           function(){ this.isMounted() && this.setState({isOpen: false}); }.bind(this),
           100);
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
