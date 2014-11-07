/**
 * @author xepa4ep
 * Mapping Vcard standard 4.0 to react components
 * @jsx React.DOM
 */
'use strict';


/**
* Email widget is a repeated fildset component.
* Format:
* type

*/

var _ = require('lodash');
Object.assign = _.extend;
var React = require('react/addons');
var RepeatedFieldsetModule = require('./RepeatingFieldset.react');
var ItemMixin = RepeatedFieldsetModule.ItemMixin;
var RepeatingFieldsetMixin = RepeatedFieldsetModule.RepeatingFieldsetMixin;

var IconSvg = require('../components/common/IconSvg.react');
var SimpleSelect = require('./input').SimpleSelect;
var ContentEditableInput = require('./input').ContentEditableInput;


function getDefaultEmailValue() {
    return {
        type: 'home',
        value: 'vasya.pupkin@gmail.com'
    }
};


function getDefaultPhoneValue() {
    return {
        type: 'mobile',
        value: '+7 777 7777777'
    }
};

function getDefaultUrlValue() {
    return {
        type: 'website',
        value: 'http://alma.net'
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
        return (
            <div {...this.props} className="inputLine inputLine--vcardRow">
                <div className="row">
                    <div className="row-icon">
                        <button type="button" onClick={this.onRemove.bind(null, this.props.index)}>
                            <IconSvg iconKey="remove" />
                        </button>
                    </div>
                    <div className="row-body">
                        <div className="inputLine-negativeTrail row-body--aligned">
                            <SimpleSelect
                                name="type"
                                options={options}
                                value={value.type}
                                component={React.DOM.div}
                                onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
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
    }
});


var EmailVCardComponent = React.createClass({
    mixins: [RepeatingFieldsetMixin],

    propTypes: {
        options: React.PropTypes.array
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
            'options': self.props.options,
            'onTypeChange': self.onChange,
            'onValueChange': self.onChange};
        var fields = this.renderFields(extraOptions);
        return (
            <div {...this.props} className="">{fields}</div>
        )
    },

    onChange: function(idx, changedValue) {
        var value = this.value();
        console.log(value, idx, changedValue);
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
        console.log(this.prepValue(this.props.name, value));
        this.updateValue(this.prepValue(this.props.name, value));
    }
});



var PhoneVCardComponentItem = React.createClass({
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
        return (
            <div {...this.props} className="inputLine inputLine--vcardRow">
                <div className="row">
                    <div className="row-icon">
                        <button type="button" onClick={this.onRemove.bind(null, this.props.index)}>
                            <IconSvg iconKey="remove" />
                        </button>
                    </div>
                    <div className="row-body">
                        <div className="inputLine-negativeTrail row-body--aligned">
                            <SimpleSelect
                                name="type"
                                options={options}
                                value={value.type}
                                component={React.DOM.div}
                                onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
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


var PhoneVCardComponent = React.createClass({
    mixins: [RepeatingFieldsetMixin],

    propTypes: {
        options: React.PropTypes.array
    },

    getDefaultProps: function() {
        return {
            item: PhoneVCardComponentItem,
            getDefaultItemValue: getDefaultPhoneValue
        }
    },

    render: function() {
        var self = this;
        var extraOptions = {
            'onFocus': self.onAddItem,
            'options': self.props.options,
            'onTypeChange': self.onChange,
            'onValueChange': self.onChange};
        var fields = this.renderFields(extraOptions);
        return (
            <div {...this.props} className="">{fields}</div>
        )
    },

    onChange: function(idx, changedValue) {
        var value = this.value();
        console.log(value, idx, changedValue);
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
        console.log(this.prepValue(this.props.name, value));
        this.updateValue(this.prepValue(this.props.name, value));
    }
});


var UrlVCardComponentItem = React.createClass({
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
        return (
            <div {...this.props} className="inputLine inputLine--vcardRow">
                <div className="row">
                    <div className="row-icon">
                        <button type="button" onClick={this.onRemove.bind(null, this.props.index)}>
                            <IconSvg iconKey="remove" />
                        </button>
                    </div>
                    <div className="row-body">
                        <div className="inputLine-negativeTrail row-body--aligned">
                            <SimpleSelect
                                name="type"
                                options={options}
                                value={value.type}
                                component={React.DOM.div}
                                onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
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


var UrlVCardComponent = React.createClass({
    mixins: [RepeatingFieldsetMixin],

    propTypes: {
        options: React.PropTypes.array
    },

    getDefaultProps: function() {
        return {
            item: UrlVCardComponentItem,
            getDefaultItemValue: getDefaultUrlValue
        }
    },

    render: function() {
        var self = this;
        var extraOptions = {
            'onFocus': self.onAddItem,
            'options': self.props.options,
            'onTypeChange': self.onChange,
            'onValueChange': self.onChange};
        var fields = this.renderFields(extraOptions);
        return (
            <div {...this.props} className="">{fields}</div>
        )
    },

    onChange: function(idx, changedValue) {
        var value = this.value();
        console.log(value, idx, changedValue);
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
        console.log(this.prepValue(this.props.name, value));
        this.updateValue(this.prepValue(this.props.name, value));
    }
});


function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}


module.exports = {
    EmailVCardComponent: EmailVCardComponent,
    PhoneVCardComponent: PhoneVCardComponent,
    UrlVCardComponent: UrlVCardComponent,
}
