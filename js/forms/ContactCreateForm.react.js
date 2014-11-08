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


var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var form_state = {
  'fn': 'Камун Рустем Абдукадырович',
  'companyName': 'Mobiliuz',
  'emails': [{'idx': 0, 'type': 'home', 'value': 'r.kamun@gmail.com'}],
  'phones': [{'idx': 0, 'type': 'mobile', 'value': '+7 777 7777777'}],
  'is_company': true,
  'urls': [{'idx': 0, 'type': 'website', 'value': 'http://alma.net'}],
  'adrs': [{'idx': 0, 'type': 'home', 'street_address': 'Zharokov, 167', 'region': 'Almaty', 'locality': 'Almaty', 'country_name': 'Kazakhstan', 'postal_code': '00012'}]
};

var ContactCreateForm = React.createClass({

  render: function() {
    return (
      <Form value={form_state}>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput isStrong={true} name='fn' />
          <ContentEditableInput isStrong={true} name='family_name' />
        </Fieldset>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput isStrong={false} className='text-secondary' name='companyName' />
        </Fieldset>
        <SVGCheckbox name="is_company" label="Company" />
        <EmailVCardComponent name="emails" options={[['home', 'home'], ['work', 'work']]} />
        <div className="space-verticalBorder"></div>

        <PhoneVCardComponent name="phones" options={[['home', 'home'], ['mobile', 'mobile']]} />
        <div className="space-verticalBorder"></div>

        <UrlVCardComponent name="urls" options={[['website', 'website'], ['github', 'github']]} />
        <div className="space-verticalBorder"></div>

        <AddressVCardComponent name="adrs" options={[['home', 'место проживания'], ['work', 'место работы']]} />
      </Form>
    )
  },

});

module.exports = ContactCreateForm;
