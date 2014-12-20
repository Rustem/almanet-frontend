/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var cx = React.addons.classSet;
var IconSvg = require('../common/IconSvg.react');
var CRMConstants = require('../../constants/CRMConstants');
var CommentCreateForm = require('../../forms/CommentCreateForm.react');
var CommentStore = require('../../stores/CommentStore');

var AppContextMixin = require('../../mixins/AppContextMixin');

var ESCAPE_KEY_CODE = 27;

var LeaveCommentButton = React.createClass({

  getDefaultProps: function() {
    return {
      onClick: undefined,
      onKeyDown: undefined,
    };
  },

  render: function() {
  		var author = this.props.author;
      	return (
		    <div className="stream-item stream-item--comment">
		        <div className="row">
		          <a href="#" className="row-icon">
		            <figure className="icon-userpic">
		  				<img src={"img/userpics/" + author.userpic} />
		            </figure>
		          </a>
		          <div className="row-body row-body--no-trailer">
		            <button className="text-strong text-primary" onClick={this.props.onClick}>
		            	Оставить комментарий
		            </button>
		          </div>
		        </div>
		    </div>
	    );
  }
});

var CommentComposer = React.createClass({
    mixins: [AppContextMixin],

    propTypes: {
    	  onHandleSubmit: React.PropTypes.func,
        activity_id: React.PropTypes.string,
    },

    componentDidMount: function() {
      CommentStore.addChangeListener(this.resetState)
    },

    componentWillUnmount: function() {
      CommentStore.removeChangeListener(this.resetState)
    },

    resetState: function() {
      this.isCommenting = false;
      this.value = undefined;
      this.forceUpdate();
    },

    render: function() {
        var StateComponent = null;

	    if (this.isCommenting) {
	        StateComponent = <CommentCreateForm
                  ref='commentCreateForm'
	                activity_id={this.props.activity_id}
	                author={this.getUser()}
	                onHandleSubmit={this.props.onHandleSubmit}
	                onCancelClick={this.onCancelClick}
	                onKeyDown={this.onFormKeyDown} 
                  value={this.value} />;
	    } else {
	        StateComponent = <LeaveCommentButton 
                              author={this.getUser()}
	        									  onClick={this.onFormToggle} />;
	    }
	    return (
	        StateComponent
	    );
    },

    onFormToggle: function(evt) {
        if(!'isCommenting' in this) {
          this.isCommenting = false;
        }
        this.isCommenting = !this.isCommenting;
        this.forceUpdate();
    },

    forceIsCommenting: function(recipient) {
        this.isCommenting = true;
        this.value = {'comment': '@'+recipient.first_name+' '}
        this.forceUpdate();
    },

    onFormKeyDown: function(evt) {
      if(evt.keyCode == ESCAPE_KEY_CODE) {
        evt.preventDefault();
        this.isCommenting = false;
        this.forceUpdate();
      }
    },

    onCancelClick: function(evt) {
    	this.resetState();
    },
});

module.exports = CommentComposer;
