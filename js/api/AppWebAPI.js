var _ = require('lodash');
var request = require('superagent');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var UserWebAPI = require('./UserWebAPI');

module.exports = {
    getAll: function(user, success, failure) {
        request
            .get('api/v1/app_state/'+CRMConstants.SERVICES.crm+'/')
            .end(function (res) {
                if (res.ok) {
                    success(res.body.objects, res.body.constants);
                } else {
                    failure(res);
                }
            });
    },
};
