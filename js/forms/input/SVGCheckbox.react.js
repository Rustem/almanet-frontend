/**
 * @jsx React.DOM
 */

var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');
var IconSvg = require('../../components/common/IconSvg.react');
var cx        = React.addons.classSet;

var SVGCheckbox = React.createClass({
    mixins : [FormElementMixin],
    propTypes: {
        label: React.PropTypes.string,
    },

    onChange: function(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        var newValue = e.target.checked;
        this.updateValue(this.prepValue(this.props.name, newValue));
        // var value = getValueFromEvent(e);
        // this.updateValue(this.prepValue(this.props.name, value));
    },

    render: function() {
        var value = this.value();
        return (
            <label {...this.props} className='checkbox'>
                <div className="checkbox-button">
                    <input name={this.props.name} onChange={this.onChange} type="checkbox" checked={value} value={value} />
                    <div className="checkbox-icon">
                        <IconSvg iconKey="checkbox-checked" />
                        <IconSvg iconKey="checkbox" />
                    </div>
                </div>
                <div className="checkbox-label">
                    {this.props.label || 'undefined'} {this.props.sublabel}
                </div>
            </label>
        )
    },
});

function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}


module.exports = SVGCheckbox;
