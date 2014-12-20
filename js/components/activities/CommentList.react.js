var React = require('react/addons');
var UserStore = require('../../stores/UserStore');

var CommentListItem = React.createClass({
    propTypes: {
        comment: React.PropTypes.object,
    },

    getAuthor: function(u_id) {
    	return UserStore.get(u_id);
    },

    render: function() {
        var comment = this.props.comment;
        var author = this.getAuthor(comment.author);

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
		              <a href="#" className="text-secondary">{author.first_name} {author.last_name}</a> в {comment.at}
		            </div>
		            <div className="row-body-message">
		              {comment.comment}
		            </div>
		            <a href="#" className="text-caption text-secondary">Ответить</a>
		          </div>
		        </div>
		    </div>
        )
    }
});

var CommentList = React.createClass({
    propTypes: {
        comments: React.PropTypes.array,
    },

    render: function() {
        var commentListItems = this.props.comments.map(function(comment) {
            return(
                <CommentListItem
                    comment={comment} />
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