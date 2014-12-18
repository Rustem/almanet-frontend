/**
 * @jsx React.DOM
 */
var _ = require('lodash')
var React = require('react');
var AppContextMixin = require('../../mixins/AppContextMixin');
var UserActionCreators = require('../../actions/UserActionCreators');

var FollowButton = React.createClass({
    mixins: [AppContextMixin],

    getInitialState: function() {
        return {
            following: !(_.contains(this.getUser().unfollow_list, this.getContact().id)),
        };
    },

    getContact: function() {
        return this.props.contact;
    },

    getLabel: function() {
        if(this.isFollowing())
            return "Отписаться";
        return "Подписаться"
    },

    isFollowing: function() {
        return this.state.following;
    },

    onClick: function() {
        var object = {};
        object.contact = this.getContact();
        object.user = this.getUser();
        UserActionCreators.toggleFollowing(object);
        this.setState({following: !this.isFollowing()});
        this.forceUpdate();
    },

    render: function() {
        return (
            <button className="btn btn--save" onClick={this.onClick}>{this.getLabel()}</button>
        );
    }

});

module.exports = FollowButton;
