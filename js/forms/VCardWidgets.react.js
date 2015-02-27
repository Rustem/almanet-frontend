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
var utils = require('../utils');

var IconSvg = require('../components/common/IconSvg.react');
var Fieldset = require('./Fieldset.react');
var inputs = require('./input');
var SimpleSelect = inputs.SimpleSelect;
var InputText = inputs.InputText;
var InputTextarea = inputs.InputTextarea;
var SVGCheckbox = inputs.SVGCheckbox;

var VCARD_MODE = require('../constants/CRMConstants').VCARD_MODE;

var getDefaultEmailValue = function() {
    return {
        type: 'home',
        value: undefined
    }
};


var getDefaultTelValue = function() {
    return {
        type: 'home',
        value: undefined
    }
};

var getDefaultUrlValue = function() {
    return {
        type: 'website',
        value: undefined
    }
};

var getDefaultAddressValue = function() {
    return {
        type: 'work',
        street_address: undefined,
        region: undefined,
        locality: undefined,
        country_name: undefined,
        postal_code: undefined
    }
}

var VCardRow = React.createClass({
    mixins: [FieldsetMixin],

    propTypes: {
        label: React.PropTypes.string,
        placeholder: React.PropTypes.string,
    },

    render: function() {
        return (
            <div className='inputLines'>
              <div className='inputLine'>
                <div className='inputLine--inflated'>
                  <strong>{ this.props.label }</strong>
                </div>
                <InputTextarea {...this.props} />
              </div>
            </div>
        )
    },

});

var EmailVCardComponentItem = React.createClass({
    mixins: [ItemMixin],

    propTypes:  {
        index: React.PropTypes.number,
        options: React.PropTypes.array,
        onAddItem: React.PropTypes.func,
        onTypeChange: React.PropTypes.func,
        onValueChange: React.PropTypes.func
    },

    render: function() {
        var value = this.props.value;
        var options = this.props.options;
        return (
            <div {...this.props} className='inputLine inputLine--compound'>
                <div className='inputLine'>
                  <button type='button' onClick={this.onRemove.bind(null, this.props.index)}>
                    <IconSvg iconKey='remove' />
                  </button>
                </div>
                <div className='inputLine inputLine--body'>
                  <div className='inputLine--inflated'>
                    <strong className='addContact-inputLine-label'>
                      Email:
                    </strong>
                    <SimpleSelect
                        name="type"
                        options={options}
                        value={value.type}
                        Component='div'
                        onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
                  </div>
                  <InputText value={value.value}
                             name="value"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Введите email' />
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
            'options': self.props.options,
            'onTypeChange': self.onChange,
            'onValueChange': self.onChange};
        var fields = this.renderFields(extraOptions);
        return (
            <div className='inputLines'>
                <div {...this.props} className="">{fields}</div>
                <div className='inputLine inputLine---inflated inputLine--r'>
                    <button type='button' className='button-u button-u--safe' onClick={this.onAddItem} >
                      Добавить email
                    </button>
                </div>
            </div>
        )
    },

    onChange: function(idx, changedValue) {
        var value = this.value();
        value[idx] = React.addons.update(value[idx], {$merge: changedValue});
        this.updateValue(this.prepValue(this.props.name, value));
    }
});



var TelVCardComponentItem = React.createClass({
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
            <div {...this.props} className='inputLine inputLine--compound'>
                <div className='inputLine'>
                  <button type='button' onClick={this.onRemove.bind(null, this.props.index)}>
                    <IconSvg iconKey='remove' />
                  </button>
                </div>
                <div className='inputLine inputLine--body'>
                  <div className='inputLine--inflated'>
                    <strong className='addContact-inputLine-label'>
                      Телефон:
                    </strong>
                    <SimpleSelect
                        name="type"
                        options={options}
                        value={value.type}
                        Component='div'
                        onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
                  </div>
                  <InputText value={value.value}
                             name="value"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Введите телефон' />
                </div>
            </div>
        )
    },
});


var TelVCardComponent = React.createClass({
    mixins: [RepeatingFieldsetMixin],

    propTypes: {
        options: React.PropTypes.array
    },

    getDefaultProps: function() {
        return {
            item: TelVCardComponentItem,
            getDefaultItemValue: getDefaultTelValue
        }
    },

    render: function() {
        var self = this;
        var extraOptions = {
            'options': self.props.options,
            'onTypeChange': self.onChange,
            'onValueChange': self.onChange};
        var fields = this.renderFields(extraOptions);
        return (
            <div className='inputLines'>
                <div {...this.props} className="">{fields}</div>
                <div className='inputLine inputLine---inflated inputLine--r'>
                    <button type='button' className='button-u button-u--safe' onClick={this.onAddItem} >
                      Добавить телефон
                    </button>
                </div>
            </div>
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
            <div {...this.props} className='inputLine inputLine--compound'>
                <div className='inputLine'>
                  <button type='button' onClick={this.onRemove.bind(null, this.props.index)}>
                    <IconSvg iconKey='remove' />
                  </button>
                </div>
                <div className='inputLine inputLine--body'>
                  <div className='inputLine--inflated'>
                    <strong className='addContact-inputLine-label'>
                      Сайт:
                    </strong>
                    <SimpleSelect
                        name="type"
                        options={options}
                        value={value.type}
                        Component='div'
                        onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
                  </div>
                  <InputText value={value.value}
                             name="value"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Введите url' />
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
            'options': self.props.options,
            'onTypeChange': self.onChange,
            'onValueChange': self.onChange};
        var fields = this.renderFields(extraOptions);
        return (
            <div className='inputLines'>
                <div {...this.props} className="">{fields}</div>
                <div className='inputLine inputLine---inflated inputLine--r'>
                    <button type='button' className='button-u button-u--safe' onClick={this.onAddItem} >
                      Добавить сайт
                    </button>
                </div>
            </div>
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
            <div {...this.props} className='inputLine inputLine--compound'>
                <div className='inputLine'>
                  <button type='button' onClick={this.onRemove.bind(null, this.props.index)}>
                    <IconSvg iconKey='remove' />
                  </button>
                </div>
                <div className='inputLine inputLine--body'>
                  <div className='inputLine--inflated'>
                    <strong className='addContact-inputLine-label'>
                      Адрес:
                    </strong>
                    <SimpleSelect
                        name="type"
                        options={options}
                        value={value.type}
                        Component='div'
                        onValueUpdate={this.props.onTypeChange.bind(null, this.props.index)} />
                  </div>
                  <InputText value={value.street_address}
                             name="street_address"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Улица' /> <br />
                  <InputText value={value.region}
                             name="region"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Город' />
                  <InputText value={value.locality}
                             name="locality"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Район' /> <br />
                  <InputText value={value.country_name}
                             name="country_name"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Страна' /> <br />
                  <InputText value={value.postal_code}
                             name="postal_code"
                             onValueUpdate={this.props.onValueChange.bind(null, this.props.index)}
                             placeholder='Почтовый индекс' />
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
            'options': self.props.options,
            'onTypeChange': self.onChange,
            'onValueChange': self.onChange};
        var fields = this.renderFields(extraOptions);
        return (
            <div className='inputLines'>
                <div {...this.props} className="">{fields}</div>
                <div className='inputLine inputLine---inflated inputLine--r'>
                    <button type='button' className='button-u button-u--safe' onClick={this.onAddItem} >
                      Добавить адрес
                    </button>
                </div>
            </div>
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
            <div className='inputLine inputLine--heading inputLine--body'>
                <InputText name='fn' {...this.props} />
            </div>
        )
    },
});

var OrgsVCardComponent = React.createClass({

    render: function() {
        return (
            <div className='inputLine'>
                <InputText name='orgs' {...this.props} placeholder='Организация' />
            </div>
        )
    },
});

var TitlesVCardComponent = React.createClass({

    render: function() {
        return (
            <div className='inputLine inputLine--caption'>
                <InputText placeholder='Должность' name='titles' {...this.props} />
            </div>
        )
    },
});

var VCardElement = React.createClass({
    mixins: [FormElementMixin],
    propTypes: {
        fields: React.PropTypes.array.isRequired,
    },

    getDefaultProps: function() {
        return {
            mode: VCARD_MODE.CONTACT
        }
    },

    getInitialState: function() {
        var value = this.value() || {};
        return {
            company_mode: this.tpUnConverter(value.tp)
        };
    },

    handleCompanyModeChange: function() {
        this.setState({
            company_mode: !this.state.company_mode
        });
    },

    componentWillMount: function() {
        this.CONTACT_TYPES = utils.get_constants('contact').tp_hash;
        var value = this.value();
        _.forEach(this.props.fields, function(f){
            this[f] = value[f];
        }.bind(this));
        this.setState(this.getInitialState());
    },

    renderContact: function() {
        var value = this.value() || {};
        var importHeading;
        var individualFields;

        if (this.state.company_mode) {
            importHeading = <FNVCardComponent key='org_fn' value={value.fn} onValueUpdate={this.onFnChange} placeholder='Название организации'/>;
        } else {
            importHeading = <FNVCardComponent key='fiz_fn' value={value.fn} onValueUpdate={this.onFnChange} placeholder='Имя фамилия'/>;
            individualFields = [
                <OrgsVCardComponent value={this.orgValue(value.orgs)} onValueUpdate={this.onOrgChange} />,
                <TitlesVCardComponent value={this.titleValue(value.titles)} onValueUpdate={this.onTitlesChange} />
            ];
        }

        return (
            <div>
                <div className='inputLines'>
                  <div className='inputLine inputLine--compound'>
                    {importHeading}
                    <div className='inputLine'>
                        <SVGCheckbox name="tp" 
                                     label="Компания" 
                                     className="compact" 
                                     value={this.tpUnConverter(value.tp)} 
                                     onValueUpdate={this.onTPChange} />
                    </div>
                  </div>
                  {individualFields}
                </div>
                <TelVCardComponent name="tels" value={value.tels} options={[['home', 'по месту проживания'], ['work', 'по месту работы']]} onValueUpdate={this.onTelsChange} />
                <EmailVCardComponent name="emails" value={value.emails} options={[['internet', 'работа'], ['pref', 'персональный']]} onValueUpdate={this.onEmailsChange} />
                <UrlVCardComponent name="urls" value={value.urls} options={[['website', 'работа'], ['github', 'персональный']]} onValueUpdate={this.onUrlsChange} />
                <AddressVCardComponent name="adrs" value={value.adrs} options={[['home', 'место проживания'], ['work', 'место работы']]} onValueUpdate={this.onAdrsChange} />
            </div>
        )
    },

    renderUser: function() {
        var value = this.value() || {};

        var importHeading = <FNVCardComponent key='fiz_fn' value={value.fn} onValueUpdate={this.onFnChange} placeholder='Имя фамилия'/>;
        var individualFields = [
            <OrgsVCardComponent value={this.orgValue(value.orgs)} onValueUpdate={this.onOrgChange} />,
            <TitlesVCardComponent value={this.titleValue(value.titles)} onValueUpdate={this.onTitlesChange} />
        ];

        return (
            <div>
                <div className='inputLines'>
                  <div className='inputLine inputLine--compound'>
                    {importHeading}
                  </div>
                  {individualFields}
                </div>
                <TelVCardComponent name="tels" value={value.tels} options={[['home', 'по месту проживания'], ['work', 'по месту работы']]} onValueUpdate={this.onTelsChange} />
                <EmailVCardComponent name="emails" value={value.emails} options={[['internet', 'работа'], ['pref', 'персональный']]} onValueUpdate={this.onEmailsChange} />
                <UrlVCardComponent name="urls" value={value.urls} options={[['website', 'работа'], ['github', 'персональный']]} onValueUpdate={this.onUrlsChange} />
                <AddressVCardComponent name="adrs" value={value.adrs} options={[['home', 'место проживания'], ['work', 'место работы']]} onValueUpdate={this.onAdrsChange} />
            </div>
        )
    },

    render: function() {
        var Component;

        if(this.props.mode == VCARD_MODE.CONTACT)
            Component = this.renderContact();
        else
            Component = this.renderUser();
        return Component
    },

    orgValue: function(orgs) {
        if(orgs == undefined || orgs.length == 0)
            return ''
        return orgs[0].organization_name
    },

    titleValue: function(titles) {
        if(titles == undefined || titles.length == 0)
            return ''
        return titles[0].data
    },

    tpUnConverter: function(v) {
        if(!this.CONTACT_TYPES)
            return false;
        return (v == this.CONTACT_TYPES.COMPANY);
    },

    tpConverter: function(v) {
        if(v)
            return this.CONTACT_TYPES && this.CONTACT_TYPES.COMPANY;
        return this.CONTACT_TYPES && this.CONTACT_TYPES.USER;
    },

    onFnChange: function(value) {
        this.fn = value.fn;
        this.onChange();
    },

    onOrgChange: function(value) {
        this.orgs = [{'organization_name': value.orgs}];
        this.onChange();
    },

    onTitlesChange: function(value) {
        this.titles = [{'data': value.titles}];
        this.onChange();
    },

    onTPChange: function(value) {
        this.handleCompanyModeChange();
        this.tp = this.tpConverter(value.tp);
        this.onChange();
    },

    onEmailsChange: function(value) {
        this.emails = value.emails;
        this.onChange();
    },

    onTelsChange: function(value) {
        this.tels = value.tels;
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
        var rv = {}
        _.forEach(this.props.fields, function(f){
            rv[f] = this[f];
        }.bind(this));
        return rv
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
    TelVCardComponent: TelVCardComponent,
    UrlVCardComponent: UrlVCardComponent,
    AddressVCardComponent: AddressVCardComponent,
    VCardElement: VCardElement,
}
