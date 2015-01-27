/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var inputs = require('./input');
var SVGCheckbox = inputs.SVGCheckbox;
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');

var VCardWidgets = require('./VCardWidgets.react');
var VCardElement = VCardWidgets.VCardElement;
var VCardRow = VCardWidgets.VCardRow;
var AppContextMixin = require('../mixins/AppContextMixin');
var VCardProcessingBehaviour = require('./behaviours/VCardProcessingBehaviour');
var AppCommonStore = require('../stores/AppCommonStore');

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');

var ContactCreateForm = React.createClass({
  mixins : [AppContextMixin, VCardProcessingBehaviour],
  propTypes: {
    onHandleSubmit: React.PropTypes.func,
  },

  render: function() {
    var value = this.preValue(this.getDefaultFormState());
    var fields = ['fn', 'orgs', 'titles', 'tp', 'tels', 'emails', 'urls', 'adrs'];
    return (
      <Form {...this.props} ref='contact_form' value={value} onSubmit={this.onHandleSubmit}>
        <VCardElement name="vcard" fields={fields} />

        <VCardRow name='note' label='Заметка' />
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
      var value = this.removeEmpty(this.postValue(form.value()));
      this.props.onHandleSubmit(value);
    } else{
        alert(errors);
    }
    return false;
  },

  getDefaultFormState: function() {
    var CONTACT_TYPES = AppCommonStore.get_constants('contact').tp_hash;

    return {
      'tp': CONTACT_TYPES.COMPANY,
      'vcard': {
        'fn': undefined,
        'orgs': [{'organization_name': undefined}],
        'emails': [{'idx': 0, 'type': 'internet', 'value': undefined}],
        'tels': [{'idx': 0, 'type': 'work', 'value': undefined}],
        'urls': [{'idx': 0, 'type': 'website', 'value': undefined}],
        'adrs': [{'idx': 0, 'type': 'home', 'street_address': undefined, 'region': undefined, 'locality': undefined, 'country_name': undefined, 'postal_code': undefined}],
      },
      'note': 'Нужно сюда съездить на встречу а то я не успеваю, подмени меня пожалуйста.'
    };
  },

});

module.exports = ContactCreateForm;
