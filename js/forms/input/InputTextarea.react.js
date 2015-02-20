/**
 * @jsx React.DOM
 */
var _ = require('lodash');
var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');
var cx        = React.addons.classSet;


var ENTER_KEY_CODE = 13;


var InputTextarea = React.createClass({
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
        if (nextProps.value !== this.props.value && nextProps.value) {
            this.setState({ inputValue: nextProps.value });
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
        return (
            <div className='input input--textarea'>
                <div className='input-shadow'>
                    {this.state.inputValue + '\n'}
                </div>
                <textarea
                    className='input-field'
                    placeholder={this.props.placeholder}
                    value={this.state.inputValue}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown} />
            </div>
        );
    }

});

module.exports = InputTextarea;
