/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var SVGCheckbox = inputs.SVGCheckbox;
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');

var VCardWidgets = require('./VCardWidgets.react');
var VCardElement = VCardWidgets.VCardElement;
var VCardRow = VCardWidgets.VCardRow;
var AppContextMixin = require('../mixins/AppContextMixin');

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var default_form_state = {
  'is_company': true,
  'vcard': {
    'fn': 'Аман Куратов',
    'org': {'value': 'ТОО "Массив Динамик"'},
    'emails': [{'idx': 0, 'type': 'internet', 'value': 'amangeldy@gmail.com'}],
    'phones': [{'idx': 0, 'type': 'work', 'value': '+7 777 7777777'}],
    'urls': [{'idx': 0, 'type': 'website', 'value': 'http://massive-dyn.com'}],
    'adrs': [{'idx': 0, 'type': 'home', 'street_address': 'Zharokov, 11', 'region': 'Almaty', 'locality': 'Almaty', 'country_name': 'Kazakhstan', 'postal_code': '00012'}], 
  },
  'note': 'Нужно сюда съездить на встречу а то я не успеваю, подмени меня пожалуйста.'
};

var ContactCreateForm = React.createClass({
  mixins : [AppContextMixin],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
  },

  render: function() {
    var value = this.preValue(default_form_state);

    return (
      <Form {...this.props} ref='contact_form' value={value} onSubmit={this.onHandleSubmit}>
        <VCardElement name="vcard" />
        
        <VCardRow name='note' label='Заметка' />
        <div className="inputLine text-right">
            <button className="btn btn--save" type="submit">Сохранить</button>
        </div>
      </Form>
    )
  },

  preValue: function(value) {
    value.vcard.is_company = value.is_company;
    return _.omit(value, 'is_company');
  },

  postValue: function(value) {
    value.is_company = value.vcard.is_company;
    value.vcard = _.omit(value.vcard, 'is_company');
    value.user_id = this.getUser().id;
    return value
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.contact_form;
    var errors = form.validate();
    if(!errors) {
      var value = this.postValue(form.value());
      this.props.onHandleSubmit(value);
    } else{
        alert(errors);
    }
    return false;
  }

});

module.exports = ContactCreateForm;
