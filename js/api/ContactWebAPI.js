var _ = require('lodash');
var SignalManager = require('./utils');
var requestPost = require('../utils').requestPost;
var requestPatch = require('../utils').requestPatch;
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var CREATION_STATUS = CRMConstants.CREATION_STATUS;

module.exports = {
    getAllContacts: function(success, failure) {
        var rawContacts = JSON.parse(localStorage.getItem('contacts'));
        setTimeout(function(){
            success(rawContacts);
        }, 0);
    },
    createContact: function(contactObject, success, failure) {
        var obj = _.extend({}, {
            is_cold: true,
            new_status: CREATION_STATUS.COLD}, contactObject);
        // return;
        requestPost('/api/v1/contact/')
            .send(obj)
            .end(function(res) {
                console.log(res);
                if (res.ok) {
                    obj = _.assign(obj, res.body);
                    success(obj);
                } else {
                    failure(obj);
                }
            });
        // for notifications
        setTimeout(function() {
            // success(obj);
            var author_id = obj.user_id,
                extra = {'contact_id': obj.id};
            // SignalManager.send(ActionTypes.CREATE_CONTACT_SUCCESS, author_id, extra);
        }, 0);
    },
    editContact: function(edit_details, success, failure) {
        // var rawContacts = JSON.parse(localStorage.getItem('contacts')) || [],
        //     contact = null;
        // for(var i = 0; i<rawContacts.length; i++) {
        //     var cur = rawContacts[i];
        //     if(cur.id === edit_details.contact_id) {
        //         rawContacts[i] = edit_details.contact;
        //         contact = cur;
        //         break;
        //     }
        // }
        // localStorage.setItem('contacts', JSON.stringify(rawContacts));
        requestPatch('/api/v1/contact/'+edit_details.contact_id)
            .send(edit_details.contact)
            .end(function(res) {
                console.log(res);
                if (res.ok) {
                    edit_details.contact = _.assign(edit_details.contact, res.body);
                    success(edit_details);
                } else {
                    failure(edit_details);
                }
            });
        setTimeout(function() {
            success(edit_details);

            // var author_id = contact.user_id,
            //     extra = {'contact_id': contact.id};
            // SignalManager.send(ActionTypes.EDIT_CONTACT_SUCCESS, author_id, extra);
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
        var timeNow = Date.now();
        var obj = _.extend({}, {
            id: 'share_' + timeNow,
            at: timeNow,
            isNew: true}, shareObject);
        var rawShares = JSON.parse(localStorage.getItem('shares')) || [];
        rawShares.push(obj);
        localStorage.setItem('shares', JSON.stringify(rawShares));
        setTimeout(function() {
            success(obj);
            var author_id = obj.author_id,
                extra = {
                    'share_id': obj.id,
                    'contact_id': obj.contact_id,
                    'receiver_id': obj.user_id};
            SignalManager.send(ActionTypes.CREATE_SHARE_SUCCESS, author_id, extra);
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
    },

    updateNewStatus: function(success) {
        var rawContacts = JSON.parse(localStorage.getItem('contacts')) || [],
            updated_cids = [];
        _.forEach(rawContacts, function(contact){
            var updated = null;
            if(contact.new_status === CREATION_STATUS.HOT){
                contact.new_status = CREATION_STATUS.COLD;
                updated = [contact.id, contact.new_status];
            } 
            if(updated) updated_cids.push(updated);
        });
        localStorage.setItem('contacts', JSON.stringify(rawContacts));

        setTimeout(function() { success(updated_cids) }, 0);
    }
};
