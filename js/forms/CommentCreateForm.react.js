/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var keyMirror = require('react/lib/keyMirror');
Object.assign = _.extend;
var React = require('react');
var inputs = require('./input');
var Input = inputs.Input;
var ContentEditableInput = inputs.ContentEditableInput;
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var Fieldset = require('./Fieldset.react');

var PLACEHOLDER = 'Напишите коммент здесь';

var default_form_state = {
  'comment': PLACEHOLDER
};

var CommentCreateForm = React.createClass({
  mixins: [FormMixin],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
    onCancelClick: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    activity_id: React.PropTypes.string,
    author: React.PropTypes.object,
  },

  render: function() {
    var author = this.props.author;
    return (
      <Form {...this.props}
            ref='comment_create_form'
            onSubmit={this.onHandleSubmit}
            onKeyDown={this.props.onKeyDown}
            value={default_form_state} >
            <Fieldset className="stream-item stream-item--comment">
              <Fieldset className="row">
                <a href="#" className="row-icon">
                  <figure className="icon-userpic">
                    <img src={"img/userpics/" + author.userpic} />
                  </figure>
                </a>
                <Fieldset className="row-body row-body--no-trailer">
                  <ContentEditableInput ref='comment' 
                                name='comment' 
                                className='input-div input-div--block' />
                  <button type="submit" className="text-strong text-primary">Написать</button><span> • </span><button onClick={this.onCancelClick} className="text-secondary">Отмена</button>
                </Fieldset>
              </Fieldset>
            </Fieldset>
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.comment_create_form;
    var errors = form.validate();
    if(!errors) {
      var value = form.value();
      value.author = this.props.author.id;
      value.activity_id = this.props.activity_id;
      this.props.onHandleSubmit(value);
    } else{
        alert(errors);
    }
    return false;
  },

  onCancelClick: function(e) {
    e.preventDefault();
    this.props.onCancelClick();
  }

});

module.exports = CommentCreateForm;
