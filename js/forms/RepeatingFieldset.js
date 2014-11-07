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

    onRemove: function() {
        if(this.props.onRemove) {
            this.props.onRemove(this.props.name)
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
        var value = this.value();
        var itemComponent = this.props.item;
        var self = this;
        var children = value.map(function(itemValue, idx){
            var unique_name = self.props.name + '--' + idx;
            return (
                <itemComponent
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
        var value = this.value();
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
        var value = this.value();
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


var EmailVCardComponentItem = React.createClass({
    mixins: [ItemMixin],

    propTypes:  {
        index: React.PropTypes.number,
        options: React.PropTypes.array,
        onFocus: React.PropTypes.func,
        onTypeChange: React.PropTypes.func,
        onValueChange: React.PropTypes.func
    },

    render: function() {
        var value = this.props.value;
        var options = this.props.options;
        return this.transferPropsTo(
            <div className="inputLine inputLine--vcardRow">
                <div className="row">
                    <div className="row-icon">
                        <button type="button" onClick={this.onRemove.bind(null, this.props.index)}>
                            <IconSvg iconKey="remove" />
                        </button>
                    </div>
                    <div className="row-body">
                        <div className="inputLine-negativeTrail row-body--aligned">
                            <SimpleSelect options={options} value={value.type} component={React.DOM.div} onChange={this.props.onTypeChange.bind(null, this.props.index)} />
                            <div className="inputLine-div">
                                <ContentEditableInput
                                    value={value.value}
                                    name="value"
                                    onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                                    onFocus={this.props.onFocus.bind(null, this.props.index)}
                                    className='input-div' data-placeholder="Телефон" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
});

function getDefaultEmailValue() {
    return {
        type: 'home',
        value: 'vasya.pupkin@gmail.com'
    }
};

var EmailVCardComponent = React.createClass({
    mixins: [RepeatingFieldsetMixin],

    propTypes: {
        emailOptions: React.PropTypes.array
    },

    getDefaultProps: function() {
        return {
            item: EmailVCardComponentItem,
            getDefaultItemValue: getDefaultEmailValue
        }
    },

    render: function() {
        var self = this;
        var extraOptions = {
            'onFocus': self.onAddItem,
            'options': self.props.emailOptions,
            'onTypeChange': self.onTypeSelected,
            'onValueChange': self.onValueChange};
        var fields = this.renderFields(extraOptions);
        return this.transferPropsTo(
            <div className="">{fields}</div>
        )
    },

    onTypeSelected: function(idx, ev) {
        var value = this.value();
        value[idx]['type'] = getValueFromEvent(ev);
        var upd = {}
        upd[this.name] = value;
        this.context.onValueUpdate(upd);
    },
    onValueChange: function(idx, updValue) {
        console.log(idx, updValue);
        var value = this.value();
        value[idx]['value'] = updValue;

        var upd = {};
        upd[this.props.name] = value;
        console.log(upd);
        this.updateValue(upd);
    }
});

function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}

module.exports = {
    EmailVCardComponent: EmailVCardComponent
}
