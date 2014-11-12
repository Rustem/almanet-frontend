var _ = require('lodash');

UserServerActionCreators = require('../actions/UserServerActionCreators')

module.exports = {
    loadCurrentUser: function() {
        user = {
            id: 1,
            email: 'r.kamun@gmail.com',
            first_name: 'Rustem',
            last_name: 'Kamun'
        }
        // simulate success callback
        setTimeout(function() {
            UserServerActionCreators.receiveCreatedContact(user);
        }, 0);
    },
}
