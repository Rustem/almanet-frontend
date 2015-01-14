/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var Form = require('./Form.react');

var VCardElement = require('./VCardWidgets.react').VCardElement;
var AppContextMixin = require('../mixins/AppContextMixin');

var UserEditForm = React.createClass({
  mixins : [AppContextMixin],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
  },

  render: function() {
    var value = this.props.value;
    var fields = ['fn', 'title', 'tels', 'emails', 'urls', 'adrs'];
    return (
      <Form {...this.props} value={value} ref='user_edit_form' onSubmit={this.onHandleSubmit}>
        <VCardElement name="vcard" fields={fields} />
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.user_edit_form;
    var errors = form.validate();
    if(!errors) {
      var value = form.value();
      this.props.onHandleSubmit(value);
    } else{
        alert(errors);
    }
    return false;
  },

  triggerSubmit: function() {
    this.onHandleSubmit({
      preventDefault: function() {}
    });
  }

});

module.exports = UserEditForm;
