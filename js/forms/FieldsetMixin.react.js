/**
 * @jsx React.DOM
 */
'use strict';

var FormElementMixin = require('./FormElementMixin.react');
var FormContextMixin = require('./FormElementMixin.react').FormContextMixin;

/**
 * Mixin for implementing fieldcomponents.
 *
 * See <Fieldset /> component for the basic implementation example.
 */
var FieldsetMixin = {
  mixins: [FormElementMixin, FormContextMixin],

};

module.exports = FieldsetMixin;
