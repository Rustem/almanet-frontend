/**
 * @jsx React.DOM
 */

var React = require('react');
var Form = require('./Form.react');
var Field = require('./Field.react');


var form_state = {
  'fn': 'Rustem',
  'ln': 'Kamun'};

var ContactCreateForm = React.createClass({
  render: function() {
    return (
      <Form value={form_state}>
        <div>
        <Field
          isStrong={true}
          name='fn'
          input={<input type="hidden" />} />
        <Field
          isStrong={true}
          name='ln'
          input={<input type="hidden" />} />
        </div>
      </Form>

    )
  },


});

module.exports = ContactCreateForm;
