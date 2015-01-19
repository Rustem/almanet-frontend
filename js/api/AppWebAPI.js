var _ = require('lodash');
var requestGet = require('../utils').requestGet;
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var UserWebAPI = require('./UserWebAPI');


module.exports = {
    getAll: function(success, failure) {
        requestGet('/api/v1/app_state/'+CRMConstants.SERVICES.crm+'/')
            .end(function (res) {
                if (res.ok) {
                    success(res.body.objects, res.body.constants);
                } else {
                    failure(res);
                }
            });
    },
};
