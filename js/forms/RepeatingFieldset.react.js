/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var FormElementMixin = require('./FormElementMixin.react');
var FormContextMixin = require('./FormElementMixin.react').FormContextMixin;
var IconSvg = require('../components/common/IconSvg.react');
var SimpleSelect = require('./input').SimpleSelect;
var ContentEditableInput = require('./input').ContentEditableInput;
var _ = require('lodash');
Object.assign = _.extend;
var ItemMixin = {
    onRemove: function(idx) {
        if(this.props.onRemove) {
            this.props.onRemove(idx);
        }
    }
};


var RepeatingFieldsetMixin = {
    mixins: [FormElementMixin, FormContextMixin],

    propTypes: {
        item: React.PropTypes.constructor,
        getDefaultItemValue: React.PropTypes.func
    },

    /**
   * Return an array of React components rendered for all the values in an array
   * this fieldset owns.
   * [{'type': 'email', 'value'}]
   * @returns {Array.<ReactComponent>}
   */
    renderFields: function(extraOptions) {
        var value = (this.value() && this.value().length > 0) ? this.value() : [this.props.getDefaultItemValue()];
        var ItemComponent = this.props.item;
        var self = this;
        var children = value.map(function(itemValue, idx){
            var unique_name = self.props.name + '--' + idx;
            return (
                <ItemComponent
                    {...extraOptions}
                    index={idx}
                    name={unique_name}
                    key={unique_name}
                    value={itemValue}
                    onRemove={self.onRemoveItem.bind(null, idx)} />
            )
        });
        return children;
    },

    /**
    * Remove a value from fieldset's value by index
    *
    * @param {Number} index
    */

    onRemoveItem: function(idx) {
        var value = (this.value() && this.value().length > 0) ? this.value() : [this.props.getDefaultItemValue()];
        var upd = {};
        if(idx === 0 && value.length === 1) {
            var defaultItem = this.props.getDefaultItemValue();
            upd[this.props.name] = [defaultItem];
            this.context.onValueUpdate(upd);
        } else {
            value.splice(idx, 1);
            upd[this.props.name] = value;
            this.context.onValueUpdate(upd);
        }
    },

     /**
       * Add new value to fieldset's value.
       */
    onAddItem: function(index) {
        var value = (this.value() && this.value().length > 0) ? this.value() : [this.props.getDefaultItemValue()];

        if(value.length - 1 === index) {
            var itemValue = this.props.getDefaultItemValue();
            // itemValue['idx'] = value.length;
            value.push(itemValue);

            var upd = {};
            upd[this.props.name] = value;
            this.onValueUpdate(upd);
        }
    }

};



module.exports = {
    ItemMixin: ItemMixin,
    RepeatingFieldsetMixin: RepeatingFieldsetMixin
}
