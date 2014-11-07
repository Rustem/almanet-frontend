/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var Fieldset = require('./Fieldset.react');

var VCardWidgets = require('./VCardWidgets.react');
var EmailVCardComponent = VCardWidgets.EmailVCardComponent;
var PhoneVCardComponent = VCardWidgets.PhoneVCardComponent;
var UrlVCardComponent = VCardWidgets.UrlVCardComponent;


var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var form_state = {
  'fn': 'Rustem',
  'family_name': 'Kamun',
  'companyName': 'Mobiliuz',
  'emails': [{'idx': 0, 'type': 'home', 'value': 'r.kamun@gmail.com'}],
  'phones': [{'idx': 0, 'type': 'mobile', 'value': '+7 777 7777777'}],
  'urls': [{'idx': 0, 'type': 'website', 'value': 'http://alma.net'}],};

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
        <EmailVCardComponent name="emails" options={[['home', 'home'], ['work', 'work']]} />
        <div className="space-verticalBorder"></div>
        <PhoneVCardComponent name="phones" options={[['home', 'home'], ['mobile', 'mobile']]} />
        <div className="space-verticalBorder"></div>
        <UrlVCardComponent name="urls" options={[['website', 'website'], ['github', 'github']]} />
      </Form>
    )
  },

});

module.exports = ContactCreateForm;
