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

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var default_form_state = {
  'fn': 'Камун Рустем Абдукадырович',
  'companyName': 'Mobiliuz',
  'emails': [{'idx': 0, 'type': 'internet', 'value': 'r.kamun@gmail.com'}],
  'phones': [{'idx': 0, 'type': 'work', 'value': '+7 777 7777777'}],
  'is_company': true,
  'urls': [{'idx': 0, 'type': 'website', 'value': 'http://alma.net'}],
  'adrs': [{'idx': 0, 'type': 'home', 'street_address': 'Zharokov, 167', 'region': 'Almaty', 'locality': 'Almaty', 'country_name': 'Kazakhstan', 'postal_code': '00012'}],
  'note': 'Нужно сюда съездить на встречу а то я не успеваю, подмени меня пожалуйста'
};

var ContactCreateForm = React.createClass({

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
  },

  render: function() {
    return (
      <Form {...this.props} ref='contact_form' value={default_form_state} onSubmit={this.onHandleSubmit}>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput isStrong={true} name='fn' />
        </Fieldset>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput isStrong={false} className='text-secondary' name='companyName' />
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
      this.props.onHandleSubmit(form.value());
    } else{
        alert(errors);
    }
    return false;
  }

});

module.exports = ContactCreateForm;
