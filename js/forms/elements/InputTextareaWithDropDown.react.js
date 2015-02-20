var _ = require('lodash');

var React = require('react/addons');
var inputs = require('../input');
var InputTextarea = inputs.InputTextarea;
var DescriptionDropDownWidget = inputs.DescriptionDropDownWidget;

var FormElementMixin = require('../FormElementMixin.react');

var InputTextareaWithDropDown = React.createClass({
    mixins : [FormElementMixin],
    propTypes: {
        choices: React.PropTypes.array.isRequired,
        placeholder: React.PropTypes.string,
    },
    getInitialState: function() {
        return {
            isOpen: false,
            inputValue: this.value() || ''
        }
    },

    emitChange: function(value) {
        this.updateValue(this.prepValue(this.props.name, value));
    },

    onUpdate: function(val) {
        var value = val[this.props.name];
        this.emitChange(value);
    },

    render: function() {
        return (
            <div className="input-addComment">
                <InputTextarea
                    ref="target_input"
                    name={this.props.name}
                    value={this.state.inputValue}
                    onValueUpdate={this.onUpdate}
                    placeholder={this.props.placeholder} />
                <DescriptionDropDownWidget
                    choices={this.props.choices}
                    onChange={this.onDropDownChange} />
            </div>
        )
    },

    onDropDownChange: function(choice_idx, choice) {
        var value = choice[0];
        this.setState({ inputValue: value });
        this.emitChange(value);
    },
});

module.exports = InputTextareaWithDropDown;
