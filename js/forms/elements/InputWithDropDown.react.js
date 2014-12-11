var _ = require('lodash');

var React = require('react/addons');
var inputs = require('../input');
var ContentEditableInput = inputs.ContentEditableInput;
var DescriptionDropDownWidget = inputs.DescriptionDropDownWidget;

var FormElementMixin = require('../FormElementMixin.react');

var InputWithDropDown = React.createClass({
    mixins : [FormElementMixin],
    propTypes: {
        choices: React.PropTypes.array.isRequired
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
                    className="input-div input-div--addComment" />
                <DescriptionDropDownWidget choices={this.props.choices}
                                onChange={this.onDropDownChange} />
            </div>
        )
    },

    onDropDownChange: function(choice_idx, choice) {
        this.updateValue(this.prepValue(this.props.name, choice[0]));
    },
});

module.exports = InputWithDropDown;