/**
 * @jsx React.DOM
 */

var React = require('react');
var Form = require('./Form.react');
var Field = require('./Field.react');
var InputDiv = require('./input').InputDiv;


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
          type="hidden"
          contenteditable={true} />
        <Field
          isStrong={true}
          name='ln'
          type="hidden"
          contenteditable={true} />
        </div>
      </Form>

    )
  },


});

module.exports = ContactCreateForm;
