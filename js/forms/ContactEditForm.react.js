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
var elements = require('./elements');
var ContactRemoveableDropDownList = elements.ContactRemoveableDropDownList;

var VCardWidgets = require('./VCardWidgets.react');
var EmailVCardComponent = VCardWidgets.EmailVCardComponent;
var PhoneVCardComponent = VCardWidgets.PhoneVCardComponent;
var UrlVCardComponent = VCardWidgets.UrlVCardComponent;
var AddressVCardComponent = VCardWidgets.AddressVCardComponent;
var VCardRow = VCardWidgets.VCardRow;

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var ContactEditForm = React.createClass({

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
        <EmailVCardComponent name="emails" options={[['internet', 'адрес в формате интернета'], ['pref', 'предпочитаемый']]} />
        <div className="space-verticalBorder"></div>

        <PhoneVCardComponent name="phones" options={[['home', 'по месту проживания'], ['work', 'по месту работы']]} />
        <div className="space-verticalBorder"></div>

        <UrlVCardComponent name="urls" options={[['website', 'website'], ['github', 'github']]} />
        <div className="space-verticalBorder"></div>

        <AddressVCardComponent name="adrs" options={[['home', 'место проживания'], ['work', 'место работы']]} />
        {CRDDL ? CRDDL : <div className="space-verticalBorder"></div>}

        <div className="inputLine text-right">
            <button className="btn btn--save" type="submit">Сохddранить</button>
        </div>
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    console.log("Rustem");
    var form = this.refs.contact_form;
    var errors = form.validate();
    if(!errors) {
      this.props.onHandleSubmit(form.value());
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
