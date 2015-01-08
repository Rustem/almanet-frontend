/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var inputs = require('./input');
var Input = inputs.Input;
var SimpleSelect = inputs.SimpleSelect;
var IconSvg = require('../components/common/IconSvg.react');
var ContentEditableInput = inputs.ContentEditableInput;
var AppContextMixin = require('../mixins/AppContextMixin');
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var Fieldset = require('./Fieldset.react');

var BASE_OPTIONS = [
  ['all', 'Все'], 
  ['recent', 'Недавние'],
  ['cold', 'Холодная база'], 
  ['lead', 'Контакты в обработке'],
]

var FilterForm = React.createClass({
  mixins: [FormMixin, AppContextMixin, Router.Navigation],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
    onHandleUserInput: React.PropTypes.func,
  },

  render: function() {
    return (
      <Form {...this.props}
            ref='filter_form'
            onSubmit={this.onHandleSubmit}
            onUpdate={this.onHandleUpdate} >
            <Fieldset className="page-header-filterContainer">
              <Fieldset className="page-header-controls row">
                <Fieldset className="row-body-primary">
                  <ContentEditableInput ref='name' 
                              name='title' 
                              className='input-div input-div--block' placeholder="New filter"/>
                </Fieldset>
              </Fieldset>
              <Fieldset className="page-header-filter row">
                <Fieldset className="row-icon">
                  <IconSvg iconKey="search" />
                </Fieldset>
                <Fieldset className="row-body row-body--inverted">
                  <Fieldset className="row-body-secondary">
                    <IconSvg iconKey="arrow-down" />
                  </Fieldset>
                  <Fieldset className="row-body-primary">
                    <Input name="filter_text" type="text" className="input-filter" placeholder="Фильтр" />
                  </Fieldset>
                </Fieldset>
              </Fieldset>
            </Fieldset>
            <Fieldset className="page-header-controls row">
              <Fieldset className="row-body-primary">
                <span>Фильтр по списку:</span>
                <Fieldset className="space-horizontal space-horizontal--compact"></Fieldset>
                <Fieldset className="select">
                  <SimpleSelect
                                name="base"
                                options={BASE_OPTIONS}
                                Component='div' />
                </Fieldset>
              </Fieldset>
              <Fieldset className="row-body-secondary">
                <button type="submit" className="text-good">Сохранить</button>
                <span> &bull; </span>
                <button className="text-bad" onClick={this.props.onCancelClick}>Отмена</button>
              </Fieldset>
            </Fieldset>
        </Form>
    );
  },

  onHandleUpdate: function(value) {
      var form = this.refs.filter_form;
      var errors = form.validate();
      if(!errors) {
          this.props.onHandleUserInput(form.value());
      } else {
          alert(errors);
      }
  },
  
  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.filter_form;
    var errors = form.validate();
    if(!errors) {
      var value = form.value();
      value.author_id = this.getUser().id;
      this.props.onHandleSubmit(value);
    } else{
        alert(errors);
    }
    return false;
  },

});

module.exports = FilterForm;
