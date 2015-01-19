var _ = require('lodash');
var UserStore = require('../stores/UserStore');
var requestGet = require('../utils').requestGet;

module.exports = {
    loadCurrentUser: function(success, failure) {
        requestGet('/api/v1/user/current/')
            .end(function (res) {
                if(res.ok) {
                    success(res.body);
                }
                else {
                    failure(res);
                }
            });
    },
}
