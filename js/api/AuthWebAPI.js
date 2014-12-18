var _ = require('lodash');
var UserStore = require('../stores/UserStore');

module.exports = {
    loadCurrentUser: function(success, failure) {
        user = UserStore.get('u_1') || {
            id: 'u_1',
            email: 'sanzhar@altayev.kz ',
            first_name: 'Санжар',
            last_name: 'Алтаев',
            userpic: 'sanzhar.png',
            unfollow_list: []
        }
        // simulate success callback
        setTimeout(function() {
            success(user);
        }, 0);
    },
}
