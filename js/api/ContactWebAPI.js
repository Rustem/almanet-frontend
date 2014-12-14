var _ = require('lodash');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

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
            is_cold: true,
            unfollow_list: []}, contactObject);
        var share = {
            id: 'share_' + Date.now(),
            user_id: contactObject.author_id,
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
            SignalManager.send(ActionTypes.CREATE_CONTACT_SUCCESS, obj.id, obj.user_id);
        }, 0);
    },
    editContact: function(edit_details, success, failure) {
        var rawContacts = JSON.parse(localStorage.getItem('contacts')) || [],
            contact = null;
        for(var i = 0; i<rawContacts.length; i++) {
            var cur = rawContacts[i];
            if(cur.id === edit_details.contact_id) {
                rawContacts[i] = edit_details.contact;
                contact = cur;
                break;
            }
        }
        localStorage.setItem('contacts', JSON.stringify(rawContacts));
        setTimeout(function() {
            success(edit_details);
            SignalManager.send(ActionTypes.EDIT_CONTACT_SUCCESS,
                               contact.id, contact.user_id);
        }, 0);
    },
    setLeads: function(contact_ids, success, failure) {
        var rawContacts = JSON.parse(localStorage.getItem('contacts')) || [];
        for(var i = 0; i<rawContacts.length; i++) {
            var cur = rawContacts[i];
            if(contact_ids.indexOf(cur.id) > -1) {
                cur.is_cold = false;
            }
        }

        localStorage.setItem('contacts', JSON.stringify(rawContacts));
        setTimeout(function(){
            success(contact_ids);
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
