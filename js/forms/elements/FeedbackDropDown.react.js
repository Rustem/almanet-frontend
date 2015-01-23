var _ = require('lodash');

var React = require('react/addons');
var inputs = require('../input');
var FeedbackDropDownWidget = inputs.FeedbackDropDownWidget;
var FeedbackDropDownWidgetSimple = inputs.FeedbackDropDownWidgetSimple;
var AppCommonStore = require('../../stores/AppCommonStore');

var FormElementMixin = require('../FormElementMixin.react');

var FeedbackDropDown = React.createClass({
    mixins: [FormElementMixin],
    componentWillMount: function() {
        this.choices = {
            OPTIONS: AppCommonStore.get_constants('activity').feedback_options,
            HASH: AppCommonStore.get_constants('activity').feedback_hash
        };
    },
    propTypes: {
        simple: React.PropTypes.bool
    },

    onChange: function(choice_idx, choice) {
        this.updateValue(this.prepValue(this.props.name, choice[0]));
    },

    render: function() {
        var Component = <FeedbackDropDownWidget value={this.value()}
                                        choices={this.choices.OPTIONS}
                                        choices_hash={this.choices.HASH}
                                        onChange={this.onChange} />;
        if(this.props.simple)
            Component = <FeedbackDropDownWidgetSimple value={this.value()}
                                        choices={this.choices.OPTIONS}
                                        choices_hash={this.choices.HASH}
                                        onChange={this.onChange} />;
        return Component
    }
});

module.exports = FeedbackDropDown;
