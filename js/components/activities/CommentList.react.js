var React = require('react/addons');
var UserStore = require('../../stores/UserStore');
var utils = require('../../utils');

var CommentListItem = React.createClass({
    propTypes: {
        comment: React.PropTypes.object,
    },

    getComment: function() {
        return this.props.comment;
    },

    getAuthor: function() {
    	return UserStore.get(this.getComment().author_id);
    },

    onReply: function(e) {
        e.preventDefault();
        this.props.onReply(this.getAuthor());
    },

    render: function() {
        var comment = this.getComment();
        var author = this.getAuthor();

        return (
        	<div className="stream-item stream-item--comment">
		        <div className="row">
		          <a href="#" className="row-icon">
		            <figure className="icon-userpic">
		  				<img src={"img/userpics/" + author.userpic} />
		            </figure>
		          </a>
		          <div className="row-body row-body--no-trailer">
		            <div className="text-caption text-secondary">
		              <a href="#" className="text-secondary">{author.vcard.fn}</a> в {utils.formatTime(comment)}
		            </div>
		            <div className="row-body-message">
		              {comment.comment}
		            </div>
		            <button onClick={this.onReply} className="text-caption text-secondary">Ответить</button>
		          </div>
		        </div>
		    </div>
        )
    }
});

var CommentList = React.createClass({
    propTypes: {
        comments: React.PropTypes.array,
        onReply: React.PropTypes.func,
    },

    onReply: function(recipient) {
        this.props.onReply(recipient);
    },

    render: function() {
        var commentListItems = this.props.comments.map(function(comment) {
            return(
                <CommentListItem
                    comment={comment} onReply={this.onReply} />
            )
        }.bind(this));

        return (
        	<div>
            {commentListItems}
            </div>
        )
    }
});

module.exports = CommentList;
