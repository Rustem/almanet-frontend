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
        value: React.PropTypes.string,
        // isStrong: React.PropTypes.bool,
        // Component: React.PropTypes.constructor
    },

    getInitialState: function() {
        return { inputValue: this.props.value || '' };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextState.inputValue !== this.state.inputValue;
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
        console.log('there!', this.props.className)

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
