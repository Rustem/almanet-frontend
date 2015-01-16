var _ = require('lodash');
var UserStore = require('../stores/UserStore');
var requestPost = require('../utils').requestPost;

module.exports = {
    loadCurrentUser: function(success, failure) {
        var createSessionAuth = function(email, password, callback) {
            requestPost('/api/v1/user_session/')
                .type('json')
                .send({email: email, password:password})
                .end(callback);
        },

        user = {
            email: 'b.wayne@batman.bat',
            password: '123'
        };

        createSessionAuth(user.email, user.password, function (res) {
            if (res.ok) {
                session = _.omit(res.body, 'user')
                user = _.assign(user, res.body.user)
                success(user, session);
            } else {}
        });
    },
}
