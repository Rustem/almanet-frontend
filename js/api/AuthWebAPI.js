var _ = require('lodash');

module.exports = {
    loadCurrentUser: function(success, failure) {
        user = {
            id: 'u_1',
            email: 'sanzhar@altayev.kz ',
            first_name: 'Санжар',
            last_name: 'Алтаев',
            userpic: 'sanzhar.png'
        }
        // simulate success callback
        setTimeout(function() {
            success(user);
        }, 0);
    },
}
