var _ = require('lodash');

ContactServerActionCreators = require('../actions/ContactServerActionCreators')

module.exports = {
    createContact: function(contactObject, callback) {
        var obj = _.extend({}, {
            id: 'c_' + Date.now(),
            is_cold: true}, contactObject);
        var share = {
            id: 'share_' + Date.now(),
            contact_id: obj.id,
            note: obj.note};
        obj.share = share;
        // simulate success callback
        setTimeout(function() {
            ContactServerActionCreators.receiveCreatedContact(obj);
        }, 0);
    },
    createShare: function(shareObject) {
        var obj = _.extend({}, {
            id: 'share_' + Date.now(),
            isNew: true}, shareObject);
        setTimeout(function() {
            ContactServerActionCreators.receiveCreatedShare(obj);
        }, 0);
    }
};
