var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');

var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _comments = {};

var CommentStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _comments[id];
    },

    getAll: function() {
        return _.map(_comments, function(c) { return c });
    },

    byActivity: function(act_id) {
        var comments = this.getAll();
        return _.filter(comments, function(c){ return c.activity_id == act_id });
    },

    getCreatedComment: function(obj) {
        return obj;
    },

});


CommentStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            _.forEach(action.object.comments, function(comment){
                _comments[comment.id] = comment;
            });
            CommentStore.emitChange();
            break;
        case ActionTypes.CREATE_COMMENT:
            // var comment = CommentStore.getCreatedComment(action.object);
            CommentStore.emitChange();
            break;
        case ActionTypes.CREATE_COMMENT_SUCCESS:
            console.log(action.object);
            var comment_with_id = CommentStore.getCreatedComment(action.object);
            _comments[comment_with_id.id] = comment_with_id;
            CommentStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = CommentStore;
