

/**
 * @jsx React.DOM
 */

var _ = require('lodash');
Object.assign = _.extend;
var React = require('react');
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var Fieldset = require('./Fieldset.react');
var waitUntil = require('../libs/wait');

var UserpicUploadForm = React.createClass({
  mixins: [FormMixin],

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
    user: React.PropTypes.object,
  },

  componentWillMount: function() {
    this.pic = null;
  },

  render: function() {
    return (
      <div className="userProfile-pic-edit">
        <Form {...this.props}
              ref='userpic_upload_form'
              onSubmit={this.onHandleSubmit}>
                <div className="row">
                  <strong>Select a file to upload</strong>
                </div>
                <div className="inputLine">
                  <input onChange={this.handleFileDialogChange} type="file" name="userpic" accept="image/*;capture=camera" />
                </div>
                <div className="inputLine">
                  <button className="btn btn--save" type="submit">Upload image</button>
                </div>
        </Form>
      </div>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    if(this.pic) {
      this.pic.user_id = this.props.user.id;
      this.props.onHandleSubmit(this.pic);
    } else {
        // alert(errors);
    }
    return false;
  },

  handleFileDialogChange: function(e) {
      this.pic = null;
      var files = e.target.files, formData = new FormData();
      var reader = new FileReader(), file = files[0];
      reader.readAsBinaryString(files[0]);
      waitUntil()
          .interval(50)
          .times(20)
          .condition(function() {
              return this.readyState === 2
          }.bind(reader))
          .done(function(result) {
              if(result) {
                  this.pic = {'name': file.name, 'pic': btoa(reader.result)};
              }
          }.bind(this))

    },

});

module.exports = UserpicUploadForm;
