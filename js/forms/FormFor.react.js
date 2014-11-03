/**
 * @jsx React.DOM
 */
'use strict';

var React                     = require('react');
var FormElementMixin          = require('./FormElementMixin.react');


/**
 * A "proxy" component which renders into field, fieldset or repeating fieldset
 * based on a current schema node.
 *
 * Example usage:
 *
 *    <FormFor name="fieldName" />
 *
 * will automatically generate a form component for the "fieldName" field of the
 * form value (retreived from current context).
 *
 * Alternatively pass value, onValueUpdate via props:
 *
 *    <FormFor
 *      value={value.get('fieldName')}
 *      onValueUpdate={onValueUpdate}
 *      />
 */
var FormFor = React.createClass({
  mixins: [FormElementMixin],

  render: function() {
    console.log('hi formfor');
    console.log(this.context);
    this.value();
    // var component = createComponentFromSchema(this.value().schema);

    // return this.transferPropsTo(component);
  }
});

module.exports = FormFor;
