/**
 * @jsx React.DOM
 */

var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');
var cx        = React.addons.classSet;

var ContentEditableInput = React.createClass({
    mixins : [FormElementMixin],
    lastHtml : null,
    propTypes: {
        isStrong: React.PropTypes.bool,
        component: React.PropTypes.component
    },

    getDefaultProps: function() {
        return {
            component: React.DOM.div
        }
    },

    emitChange: function() {
        // sends a change to parent form
        var val = this.getDOMNode().getElementsByTagName('span')[0].innerHTML;
        if(val !== this.lastHtml){
            this.onChange({
                target: {value: val}
            });
        }
    },

    onChange: function(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        var value = getValueFromEvent(e);
        var upd = {};
        upd[this.props.name] = value;
        this.context.onValueUpdate(upd);
    },

    render: function() {
        var value = this.value();
        console.log(value, "Rerender")
        var className = cx({
          'input-div': true,
          'input-div--strong': this.props.isStrong,
        });
        var component = this.props.component;
        return this.transferPropsTo(
            <component
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable={true}
                className={cx(className, this.props.className)}>{value}<input type="hidden" value={value} />
            </component>
        );
    },
});

function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}


module.exports = ContentEditableInput;
