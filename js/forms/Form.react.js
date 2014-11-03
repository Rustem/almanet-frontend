/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx        = React.addons.classSet;
var FormMixin = require('./FormMixin.react');
var FormFor = require('./FormFor.react');


var Form = React.createClass({
    mixins: [FormMixin],

    propTypes: {
        component: React.PropTypes.constructor,
        onUpdate: React.PropTypes.func
    },

    render: function() {
        var component = this.props.component;
        var className = cx({

        });
        var drawnChildren = React.Children.map(this.props.children,
                                               this.shareValue);
        return this.transferPropsTo(
          <component className={className}>
            {drawnChildren}

          </component>
        );
    },

    getDefaultProps: function() {
        return {component: React.DOM.form};
    },

    valueUpdated: function(value) {
        // validation in future
        var isSuccess = true;
        if (this.props.onUpdate && isSuccess) {
          this.props.onUpdate(value);
        }
    }

});

module.exports = Form;
