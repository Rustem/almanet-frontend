var _ = require('lodash');

ContactServerActionCreators = require('../actions/ContactServerActionCreators')

module.exports = {
    createContact: function(contactObject) {
        obj = _.extend({}, {id: 'c_' + Date.now()}, contactObject);
        // simulate success callback
        setTimeout(function() {
            ContactServerActionCreators.receiveCreatedContact(obj);
        }, 0);
    },
    createShare: function(shareObject) {
        obj = _.extend({}, {id: 'share_' + Date.now()}, shareObject);
        setTimeout(function() {
            ContactServerActionCreators.receiveCreatedShare(obj);
        }, 0);
    }
}
