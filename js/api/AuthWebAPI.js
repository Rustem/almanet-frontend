var _ = require('lodash');

module.exports = {
    loadCurrentUser: function(success, failure) {
        user = {
            id: 1,
            email: 'r.kamun@gmail.com',
            first_name: 'Rustem',
            last_name: 'Kamun'
        }
        // simulate success callback
        setTimeout(function() {
            success(user);
        }, 0);
    },
}
