/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var EmailVCardComponent = require('./RepeatingFieldset.js').EmailVCardComponent;
var Form = require('./Form.react');
var Fieldset = require('./Fieldset.react')


var form_state = {
  'fn': 'Rustem',
  'ln': 'Kamun',
  'companyName': 'Almacloud',
  'emails': [{'idx': 0, 'type': 'home', 'value': 'r.kamun@gmail.com'}]};

var ContactCreateForm = React.createClass({
  render: function() {
    return (
      <Form value={form_state}>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput isStrong={true} name='fn'/>
          <ContentEditableInput isStrong={true} name='ln'/>
        </Fieldset>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput isStrong={false} className='text-secondary' name='companyName' />
        </Fieldset>
        <EmailVCardComponent name="emails" emailOptions={[['home', 'home'], ['work', 'work']]} />
      </Form>
    )
  },


});

module.exports = ContactCreateForm;
