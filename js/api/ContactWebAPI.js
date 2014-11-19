var _ = require('lodash');

ContactServerActionCreators = require('../actions/ContactServerActionCreators')

module.exports = {
    getAllContacts: function(success, failure) {
        var rawContacts = JSON.parse(localStorage.getItem('contacts'));
        setTimeout(function(){
            success(rawContacts);
        }, 0);
    },
    createContact: function(contactObject, success, failure) {
        var timeNow = Date.now();
        var obj = _.extend({}, {
            id: 'c_' + timeNow,
            at: timeNow,
            is_cold: true}, contactObject);
        var share = {
            id: 'share_' + Date.now(),
            contact_id: obj.id,
            at: timeNow,
            note: obj.note,
            isNew: true};
        obj.share = share;
        // set contact to local storage
        var rawContacts = JSON.parse(localStorage.getItem('contacts')) || [];
        rawContacts.push(obj);
        localStorage.setItem('contacts', JSON.stringify(rawContacts));

        // set share to local storage
        var rawShares = JSON.parse(localStorage.getItem('shares')) || [];
        rawShares.push(share);
        localStorage.setItem('shares', JSON.stringify(rawShares));
        // simulate success callback
        setTimeout(function() {
            success(obj);
        }, 0);
    },
    getAllShares: function(success, failure) {
        var rawShares = JSON.parse(localStorage.getItem('shares'));
        setTimeout(function(){
            success(rawShares);
        }, 0);
    },
    createShare: function(shareObject, success, failure) {
        var obj = _.extend({}, {
            id: 'share_' + Date.now(),
            isNew: true}, shareObject);
        var rawShares = JSON.parse(localStorage.getItem('shares')) || [];
        rawShares.push(obj);
        localStorage.setItem('shares', JSON.stringify(rawShares));
        setTimeout(function() {
            success(obj);
        }, 0);
    },
    markSharesAsRead: function(share_ids, success, failure) {
        var rawShares = JSON.parse(localStorage.getItem('shares'));

        _.forEach(rawShares, function(share){
            _.forEach(share_ids, function(share_id){
                if(share.id === share_id){
                    share.isNew = false;
                }
            });
        });
        localStorage.setItem('shares', JSON.stringify(rawShares)) || [];
        setTimeout(function() {
            success(share_ids);
        }, 0);
    }
};
