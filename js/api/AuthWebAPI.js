var _ = require('lodash');

module.exports = {
    loadCurrentUser: function(success, failure) {
		var requestGet = require('../utils').requestGet;
        requestGet('/api/v1/user/current/')
            .end(function (res) {
                if(res.ok)
                    success(res.body);
                else
                    failure(res);
            });
    },
}
