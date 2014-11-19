var _ = require('lodash');

ContactServerActionCreators = require('../actions/ContactServerActionCreators')

module.exports = {
    createContact: function(contactObject, success, failure) {
        var timeNow = Date.now();
        var obj = _.extend({}, {
            id: 'c_' + timeNow,
            at: timeNow,
            is_cold: true}, contactObject);
        var share = {
            id: 'share_' + Date.now(),
            contact_id: obj.id,
            at: timeNow,
            note: obj.note,
            isNew: true};
        obj.share = share;
        // simulate success callback
        setTimeout(function() {
            success(obj);
        }, 0);
    },
    createShare: function(shareObject, success, failure) {
        var obj = _.extend({}, {
            id: 'share_' + Date.now(),
            isNew: true}, shareObject);
        setTimeout(function() {
            success(obj);
        }, 0);
    },
    markSharesAsRead: function(share_ids, success, failure) {
        setTimeout(function() {
            success(share_ids);
        }, 0);
    }
};
