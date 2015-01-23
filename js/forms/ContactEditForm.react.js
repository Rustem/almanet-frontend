/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var SVGCheckbox = inputs.SVGCheckbox;
var Form = require('./Form.react');
var Fieldset = require('./Fieldset.react');
var elements = require('./elements');
var ContactRemoveableDropDownList = elements.ContactRemoveableDropDownList;

var VCardElement = require('./VCardWidgets.react').VCardElement;
var AppContextMixin = require('../mixins/AppContextMixin');
var VCardProcessingBehaviour = require('./behaviours/VCardProcessingBehaviour');

var CONTACT_TYPES = require('../constants/CRMConstants').CONTACT_TYPES;

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var ContactEditForm = React.createClass({
  mixins : [AppContextMixin, VCardProcessingBehaviour],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
  },

  render: function() {
    var CRDDL = null ;
    var value = this.preValue(this.props.value);
    var fields = ['fn', 'orgs', 'titles', 'tp', 'tels', 'emails', 'urls', 'adrs'];

    if (value.vcard.tp == CONTACT_TYPES.CO) {
      CRDDL = <ContactRemoveableDropDownList
                    excludeCompanies={true}
                    name="children"
                    title="Работники в этой компании"
                    filter_placeholder="Добавьте контакт" />;
    }

    return (
      <Form {...this.props} value={value} ref='contact_edit_form' onSubmit={this.onHandleSubmit}>
        <VCardElement name="vcard" fields={fields} />

        {CRDDL ? CRDDL : <div className="space-verticalBorder"></div>}
        <div className="inputLine text-right">
            <button className="btn btn--save" type="submit">Сохранить</button>
        </div>
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.contact_edit_form;
    var errors = form.validate();
    if(!errors) {
      var value = this.removeEmpty(this.postValue(form.value()));
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

module.exports = ContactEditForm;
