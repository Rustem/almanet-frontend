var _ = require('lodash');

ContactServerActionCreators = require('../actions/ContactServerActionCreators')

module.exports = {
    createContact: function(contactObject) {
        obj = _.extend({}, {id: 'c_' + Date.now()}, contactObject);
        // simulate success callback
        setTimeout(function() {
            ContactServerActionCreators.receiveCreatedContact(obj);
        }, 0);
    }
}
