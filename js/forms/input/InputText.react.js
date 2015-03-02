/**
 * @jsx React.DOM
 */
var _ = require('lodash');
var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');
var cx        = React.addons.classSet;


var ENTER_KEY_CODE = 13;


var InputText = React.createClass({
    mixins : [FormElementMixin],
    propTypes: {
        value: React.PropTypes.string
    },

    getInitialState: function() {
        return { inputValue: this.value() || '' };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.value !== this.props.value || nextState.inputValue !== this.state.inputValue;
    },

    componentWillReceiveProps: function(nextProps) {
        if(nextProps.value !== this.props.value) {
            var newState = React.addons.update(this.state, {inputValue: {$set: nextProps.value || ''}});
            this.setState(newState);
        }
    },

    emitChange: function(value) {
        this.updateValue(this.prepValue(this.props.name, value));
    },

    handleChange: function(e) {
        this.setState({ inputValue: e.target.value });
        this.emitChange(e.target.value);
    },
    handleKeyDown: function(e) {
        if (e.keyCode === ENTER_KEY_CODE && e.shiftKey) {
            e.preventDefault();
            var inputValue = this.refs.inputValue.getDOMNode().value.trim();
            if (!inputValue) {
                return;
            }

            this.refs.inputValue.getDOMNode().value = '';
            this.setState({inputValue: ''});
            this.emitChange('');
        }
    },

    render: function() {
        var classes = cx({
            'input input--text': true,
            'input--defaultState': this.state.inputValue.length === 0
        });

        var inputClasses = {};
        var raw_classNames = this.props.className ? this.props.className.split(" ") : [];
        _.forEach(raw_classNames, function(cn){
            inputClasses[cn] = true;
        });
        inputClasses['input-field'] = true;
        inputClasses = cx(inputClasses);

        return (
            <div className={classes}>
                <div className='input-placeholder'>
                    {this.props.placeholder}
                </div>
                <div className='input-shadow'>
                    {this.state.inputValue + '\n'}
                </div>
                <input
                    className={inputClasses}
                    type='text'
                    value={this.state.inputValue}
                    placeholder={this.props.placeholder}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown} />
            </div>
        );
    }
});

module.exports = InputText;
