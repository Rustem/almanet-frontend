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
var FormElementMixin = require('./FormElementMixin.react');
var FieldsetMixin = require('./FieldsetMixin.react');
var RepeatedFieldsetModule = require('./RepeatingFieldset.react');
var ItemMixin = RepeatedFieldsetModule.ItemMixin;
var RepeatingFieldsetMixin = RepeatedFieldsetModule.RepeatingFieldsetMixin;

var IconSvg = require('../components/common/IconSvg.react');
var Fieldset = require('./Fieldset.react');
var inputs = require('./input');
var SimpleSelect = inputs.SimpleSelect;
var ContentEditableInput = inputs.ContentEditableInput;
var SVGCheckbox = inputs.SVGCheckbox;

var CONTACT_TYPES = require('../constants/CRMConstants').CONTACT_TYPES;

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

function getDefaultAddressValue() {
    return {
        type: 'work',
        street_address: 'your street address',
        region: 'your region',
        locality: 'city name',
        country_name: 'country name',
        postal_code: 'postal code'
    }
}

var VCardRow = React.createClass({
    mixins: [FieldsetMixin],

    propTypes: {
        label: React.PropTypes.string
    },

    render: function() {
        return (
            <div className="inputLine inputLine--vcardRow">
                <div className="row">
                    <div className="row-icon"></div>
                </div>
                <div className="row-body">
                    <div className="inputLine-negativeTrail row-body--aligned">
                        {this.renderLabel()}
                    </div>
                </div>
                <div className="inputLine-div">
                    <ContentEditableInput {...this.props} className='input-div input-div--area' isStrong={false} />
                </div>
            </div>
        )
    },
    renderLabel: function() {
        return (
          <label
            className="text-caption text-secondary row-body--aligned"
            htmlFor={this.props.name}>
            {this.props.label}
          </label>
        );
    }
});

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
                                Component='div'
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
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
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
                                Component='div'
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
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
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
                                Component='div'
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
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
        this.updateValue(this.prepValue(this.props.name, value));
    }
});


var AddressVCardComponentItem = React.createClass({
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
                                Component='div'
                                onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
                            <div className="inputLine-div">
                                <ContentEditableInput
                                    value={value.street_address}
                                    name="street_address"
                                    onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                                    className='input-div' data-placeholder="Street address" />
                            </div>
                            <div className="inputLine-div">
                                <ContentEditableInput
                                    value={value.region}
                                    name="region"
                                    onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                                    className='input-div' data-placeholder="Region" />

                                <ContentEditableInput
                                    value={value.locality}
                                    name="locality"
                                    onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                                    className='input-div' data-placeholder="Locality" />
                            </div>
                            <div className="inputLine-div">
                                <ContentEditableInput
                                    value={value.country_name}
                                    name="country_name"
                                    onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                                    className='input-div' data-placeholder="Country" />
                            </div>
                            <div className="inputLine-div">
                                <ContentEditableInput
                                    value={value.postal_code}
                                    name="postal_code"
                                    onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                                    onFocus={this.props.onFocus.bind(null, this.props.index)}
                                    className='input-div' data-placeholder="Postal code" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },

});


var AddressVCardComponent = React.createClass({
    mixins: [RepeatingFieldsetMixin],

    propTypes: {
        options: React.PropTypes.array
    },

    getDefaultProps: function() {
        return {
            item: AddressVCardComponentItem,
            getDefaultItemValue: getDefaultAddressValue
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
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
        this.updateValue(this.prepValue(this.props.name, value));
    }
});

var FNVCardComponent = React.createClass({
    mixins: [FormElementMixin],

    render: function() {
        return (
            <Fieldset className="inputLine-negativeTrail">
              <ContentEditableInput className="input-div input-div--strong" name='fn' {...this.props} />
            </Fieldset>
        )
    },
});

var OrgVCardComponent = React.createClass({

    render: function() {
        return (
            <Fieldset className="inputLine-negativeTrail">
              <ContentEditableInput className="input-div text-secondary" name='org' {...this.props} />
            </Fieldset>
        )
    },
});

var VCardElement = React.createClass({
    mixins: [FormElementMixin],

    componentWillMount: function() {
        var value = this.value();
        this.fn = value.fn;
        this.org = value.org;
        this.tp = value.tp;
        this.emails = value.emails;
        this.phones = value.phones;
        this.urls = value.urls;
        this.adrs = value.adrs;
    },

    render: function() {
        var value = this.value() || {};
        return (
            <div>
                <FNVCardComponent value={value.fn} onValueUpdate={this.onFnChange} />
                <OrgVCardComponent value={value.org.value} onValueUpdate={this.onOrgChange} />

                <SVGCheckbox name="tp" label="Company" className="row input-checkboxCompact" value={this.tpUnConverter(value.tp)} onValueUpdate={this.onTPChange} />
                
                <EmailVCardComponent name="emails" value={value.emails} options={[['internet', 'адрес в формате интернета'], ['pref', 'предпочитаемый']]} onValueUpdate={this.onEmailsChange} />
                <div className="space-verticalBorder"></div>

                <PhoneVCardComponent name="phones" value={value.phones} options={[['home', 'по месту проживания'], ['work', 'по месту работы']]} onValueUpdate={this.onPhonesChange} />
                <div className="space-verticalBorder"></div>

                <UrlVCardComponent name="urls" value={value.urls} options={[['website', 'website'], ['github', 'github']]} onValueUpdate={this.onUrlsChange} />
                <div className="space-verticalBorder"></div>

                <AddressVCardComponent name="adrs" value={value.adrs} options={[['home', 'место проживания'], ['work', 'место работы']]} onValueUpdate={this.onAdrsChange} />
            </div>
        )
    },

    tpUnConverter: function(v) {
        return (v == CONTACT_TYPES.CO);
    },

    tpConverter: function(v) {
        if(v)
            return CONTACT_TYPES.CO;
        return CONTACT_TYPES.USER;
    },

    onFnChange: function(value) {
        this.fn = value.fn;
        this.onChange();
    },

    onOrgChange: function(value) {
        this.org = value.org;
        this.onChange();
    },

    onTPChange: function(value) {
        this.tp = this.tpConverter(value.tp);
        this.onChange();
    },

    onEmailsChange: function(value) {
        this.emails = value.emails;
        this.onChange();
    },

    onPhonesChange: function(value) {
        this.phones = value.phones;
        this.onChange();
    },

    onUrlsChange: function(value) {
        this.urls = value.urls;
        this.onChange();
    },

    onAdrsChange: function(value) {
        this.adrs = value.adrs;
        this.onChange();
    },

    retriveValue: function() {
        return {
            'fn': this.fn,
            'org': this.org,
            'tp': this.tp,
            'emails': this.emails,
            'phones': this.phones,
            'urls': this.urls,
            'adrs': this.adrs,
        }
    },

    onChange: function() {
        var value = this.retriveValue();
        this.updateValue(this.prepValue(this.props.name, value));
    }
});

function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}


module.exports = {
    VCardRow: VCardRow,
    EmailVCardComponent: EmailVCardComponent,
    PhoneVCardComponent: PhoneVCardComponent,
    UrlVCardComponent: UrlVCardComponent,
    AddressVCardComponent: AddressVCardComponent,
    VCardElement: VCardElement,
}
