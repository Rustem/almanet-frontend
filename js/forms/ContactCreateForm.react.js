/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var SVGCheckbox = inputs.SVGCheckbox;
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var Fieldset = require('./Fieldset.react');

var VCardWidgets = require('./VCardWidgets.react');
var EmailVCardComponent = VCardWidgets.EmailVCardComponent;
var PhoneVCardComponent = VCardWidgets.PhoneVCardComponent;
var UrlVCardComponent = VCardWidgets.UrlVCardComponent;
var AddressVCardComponent = VCardWidgets.AddressVCardComponent;
var VCardRow = VCardWidgets.VCardRow;
var AppContextMixin = require('../mixins/AppContextMixin');

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var default_form_state = {
  'fn': 'Аман Куратов',
  'companyName': 'ТОО "Массив Динамик"',
  'emails': [{'idx': 0, 'type': 'internet', 'value': 'amangeldy@gmail.com'}],
  'phones': [{'idx': 0, 'type': 'work', 'value': '+7 777 7777777'}],
  'is_company': true,
  'urls': [{'idx': 0, 'type': 'website', 'value': 'http://massive-dyn.com'}],
  'adrs': [{'idx': 0, 'type': 'home', 'street_address': 'Zharokov, 11', 'region': 'Almaty', 'locality': 'Almaty', 'country_name': 'Kazakhstan', 'postal_code': '00012'}],
  'note': 'Нужно сюда съездить на встречу а то я не успеваю, подмени меня пожалуйста.'
};

var ContactCreateForm = React.createClass({
  mixins : [AppContextMixin],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
  },

  render: function() {
    return (
      <Form {...this.props} ref='contact_form' value={default_form_state} onSubmit={this.onHandleSubmit}>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput className="input-div input-div--strong" name='fn' />
        </Fieldset>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput className='input-div text-secondary' name='companyName' />
        </Fieldset>
        <SVGCheckbox name="is_company" label="Company" className="row input-checkboxCompact" />
        <EmailVCardComponent name="emails" options={[['internet', 'адрес в формате интернета'], ['pref', 'предпочитаемый']]} />
        <div className="space-verticalBorder"></div>

        <PhoneVCardComponent name="phones" options={[['home', 'по месту проживания'], ['work', 'по месту работы']]} />
        <div className="space-verticalBorder"></div>

        <UrlVCardComponent name="urls" options={[['website', 'website'], ['github', 'github']]} />
        <div className="space-verticalBorder"></div>

        <AddressVCardComponent name="adrs" options={[['home', 'место проживания'], ['work', 'место работы']]} />
        <VCardRow name='note' label='Заметка' />
        <input type="hidden" name="author_id" value={this.getUser().id} />
        <div className="inputLine text-right">
            <button className="btn btn--save" type="submit">Сохранить</button>
        </div>
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.contact_form;
    var errors = form.validate();
    if(!errors) {
      var value = form.value();
      console.log(value);
      return;
      value.is_company = + value.is_company; // convert bool to int
      value.owner_id = this.getUser().id;
      value.vcard = {};
      value.status = 0;
      value.vcard.org = {'value': value.companyName}
      value.vcard.fn = value.fn;
      value.vcard.emails = value.emails;
      value.vcard.adrs = value.adrs;  
      value.vcard.phones = value.phones;
      value.vcard.urls = value.urls;
      // return;

      value = _.omit(value, 'fn');
      value = _.omit(value, 'emails');
      value = _.omit(value, 'adrs');
      value = _.omit(value, 'phones');
      value = _.omit(value, 'urls');
      console.log(value);
      this.props.onHandleSubmit(value);
    } else{
        alert(errors);
    }
    return false;
  }

});

module.exports = ContactCreateForm;
