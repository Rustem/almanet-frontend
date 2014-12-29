var _ = require('lodash');
var $ = require('jquery');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var UserWebAPI = require('./UserWebAPI');

module.exports = {
    getAll: function(user, success, failure) {
        UserWebAPI.getSubscriptions(user, function (subscriptions) {
            var subscription_id = subscriptions[CRMConstants.SERVICES.crm].id

            $.get('api/v1/app_state/'+subscription_id+'/')
                .done(function (data) {
                    success(data.objects);
                });
        });
    },
};
