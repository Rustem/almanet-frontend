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
var AppContextMixin = require('../mixins/AppContextMixin');

var PLACEHOLDER = 'Напишите коммент здесь';

var default_form_state = {
  'comment': PLACEHOLDER
};

var CommentCreateForm = React.createClass({
  mixins: [FormMixin, AppContextMixin],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
    activity_id: React.PropTypes.string,
  },

  render: function() {
    var author = this.getUser();
    return (
      <Form {...this.props}
            ref='comment_create_form'
            onSubmit={this.onHandleSubmit}
            value={default_form_state} >
            <div className="stream-item stream-item--comment">
              <div className="row">
                <a href="#" className="row-icon">
                  <figure className="icon-userpic">
                    <img src={"img/userpics/" + author.userpic} />
                  </figure>
                </a>
                <div className="row-body row-body--no-trailer">
                  <ContentEditableInput ref='comment' 
                                name='comment' 
                                className='input-div input-div--block' />
                  <button type="submit" className="text-strong text-primary">Написать</button> • <a href="#" className="text-secondary">Отмена</a>
                </div>
              </div>
            </div>
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.comment_create_form;
    var errors = form.validate();
    if(!errors) {
      var value = form.value();
      value.author = this.getUser().id;
      value.activity_id = this.props.activity_id;
      this.props.onHandleSubmit(value);
    } else{
        alert(errors);
    }
    return false;
  }

});

module.exports = CommentCreateForm;
