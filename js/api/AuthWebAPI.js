var _ = require('lodash');
var UserStore = require('../stores/UserStore');
var $ = require('jquery');

module.exports = {
    loadCurrentUser: function(success, failure) {
        var createSessionAuth = function(email, password, success) {
                $.ajax({
                    url: 'api/v1/user_session/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({email: email, password:password})
                })
                .done(success)
                .fail(function (jqxhr, err) {
                    console.log(err);
                });
            },
            getSessionUser = function(success) {
                $.ajax({
                    url: 'api/v1/user_session/',
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .done(function (data) {
                    session = _.omit(data.objects[0], 'user')
                    user = _.assign(user, data.objects[0].user)
                    success(user, session);
                })
                .fail(function (jqxhr, err) {
                    console.log(err);
                })
            },
            user = {
                email: 'b.wayne@batman.bat',
                password: '123'
            };

        createSessionAuth(user.email, user.password, function() {
            getSessionUser(success);
        });
    },
}
