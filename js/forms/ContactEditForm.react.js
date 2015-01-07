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

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var ContactEditForm = React.createClass({
  mixins : [AppContextMixin],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
  },

  render: function() {
    var CRDDL = null ;
    if (this.props.value.is_company) {
      CRDDL = <ContactRemoveableDropDownList
                    excludeCompanies={true}
                    name="contacts"
                    title="Работники в этой компании"
                    filter_placeholder="Добавьте контакт" />;
    }
    return (
      <Form {...this.props} ref='contact_form' onSubmit={this.onHandleSubmit}>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput className="input-div input-div--strong" name='fn' />
        </Fieldset>
        <Fieldset className="inputLine-negativeTrail">
          <ContentEditableInput className='input-div text-secondary' name='companyName' />
        </Fieldset>
        <SVGCheckbox name="is_company" label="Company" className="row input-checkboxCompact" />
        <VCardElement name="vcard" />

        {CRDDL ? CRDDL : <div className="space-verticalBorder"></div>}
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
      value.user_id = this.getUser().id;
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
