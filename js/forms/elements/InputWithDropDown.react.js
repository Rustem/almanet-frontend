var _ = require('lodash');

var React = require('react/addons');
var inputs = require('../input');
var ContentEditableInput = inputs.ContentEditableInput;
var DescriptionDropDownWidget = inputs.DescriptionDropDownWidget;

var FormElementMixin = require('../FormElementMixin.react');

var InputWithDropDown = React.createClass({
    mixins : [FormElementMixin],
    propTypes: {
        choices: React.PropTypes.array.isRequired,
        placeholder: React.PropTypes.string,
    },
    getInitialState: function() {
        return {
            isOpen: false
        }
    },

    onUpdate: function(val) {
        this.updateValue(this.prepValue(this.props.name, val));
    },

    render: function() {
        var value = this.value();

        return (
            <div className="input-addComment">
                <ContentEditableInput
                    ref="target_input"
                    name={this.props.name}
                    onValueUpdate={this.onUpdate}
                    className="input-div input-div--addComment"
                    placeholder={this.props.placeholder} />
                <DescriptionDropDownWidget choices={this.props.choices}
                                onChange={this.onDropDownChange} />
            </div>
        )
    },

    onDropDownChange: function(choice_idx, choice) {
        var value = choice[0];
        this.refs.target_input.setInnerText(value);
        this.updateValue(this.prepValue(this.props.name, value));
    },
});

module.exports = InputWithDropDown;
