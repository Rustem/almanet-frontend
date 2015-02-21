var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');

var SimpleInput = React.createClass({
    mixins : [FormElementMixin],

    onChange: function(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        var value = this.getValueFromEvent(e);
        this.updateValue(this.prepValue(this.props.name, value));
    },

    render: function() {
        return (
            <input {...this.props} onChange={this.onChange} autoComplete='off' value={this.value()} />
        )
    }
});

module.exports = SimpleInput;
