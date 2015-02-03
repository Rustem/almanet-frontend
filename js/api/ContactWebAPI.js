var _ = require('lodash');
var SignalManager = require('./utils');
var requestPost = require('../utils').requestPost;
var requestPatch = require('../utils').requestPatch;
var request = require('../utils').request;
var waitUntil = require('../libs/wait');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
    getAllContacts: function(success, failure) {
        var rawContacts = JSON.parse(localStorage.getItem('contacts'));
        setTimeout(function(){
            success(rawContacts);
        }, 0);
    },
    createContact: function(obj, success, failure) {
        var obj = obj;
        requestPost('/api/v1/contact/')
            .send(obj)
            .on('error', failure.bind(null, obj))
            .end(function(res) {
                if (res.ok) {
                    obj = _.assign(obj, res.body);
                    success(obj);

                    // for notifications
                    var author_id = obj.user_id,
                        extra = {'contact_id': obj.id};
                    SignalManager.send(ActionTypes.CREATE_CONTACT_SUCCESS, author_id, extra);
                } else {
                    failure(obj);
                }
            });
    },

    importContacts: function(vcard_file, success, failure) {
        requestPost('/api/v1/contact/import/')
            .send({'uploaded_file': vcard_file[1]})
            .on('error', failure.bind(null, {'uploaded_file': vcard_file[1]}))
            .end(function(error, res){
                if(res.ok) {
                    success(res.body.success)
                    var extra = {'count': res.body.success.length};
                    SignalManager.send(ActionTypes.IMPORT_CONTACTS_SUCCESS, null, extra);
                } else {
                    failure();
                }
            });
    },

    editContact: function(edit_details, success, failure) {
        requestPatch('/api/v1/contact/'+edit_details.contact_id + '/')
            .send(edit_details.contact)
            .on('error', failure.bind(null, edit_details))
            .end(function(res) {
                if (res.ok) {
                    edit_details.contact = _.assign(edit_details.contact, res.body);
                    success(edit_details);

                    // for notifications
                    var author_id = edit_details.contact.user_id,
                        extra = {'contact_id': edit_details.contact.id};
                    SignalManager.send(ActionTypes.EDIT_CONTACT_SUCCESS, author_id, extra);
                } else {
                    failure(edit_details);
                }
            });
    },

    deleteContact: function(contact, success, failure) {
        request('DELETE', '/api/v1/contact/'+contact.id+'/')
            .on('error', failure.bind(null, contact))
            .end(function(res) {
                if (res.ok) {
                    success(contact);

                    // var extra = {'count': res.body.success.length};
                    // SignalManager.send(ActionTypes.DELETE_CONTACT_SUCCESS, null, extra);
                } else
                    failure(res);
            });
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
        requestPost('/api/v1/share/share_multiple/')
            .send(shareObject)
            .on('error', failure.bind(null, shareObject))
            .end(function(res) {
                if (res.ok) {
                    obj = res.body;
                    success(obj);
                    if(obj.objects.length > 0) {
                        shares = obj.objects;
                        var author_id = shares[0].share_from,
                            extra = {
                                'shares': _.map(shares, function(s){ return s.id }),
                                'contacts': _.map(shares, function(s){ return s.contact }),
                                'receivers': _.map(shares, function(s){ return s.share_to })};
                        SignalManager.send(ActionTypes.CREATE_SHARE_SUCCESS, author_id, extra);
                    }
                } else {
                    failure(obj);
                }
            });
    },
    markSharesAsRead: function(share_ids, success, failure) {
        var obj;
        requestPost('/api/v1/share/read/')
            .send(JSON.stringify({share_ids: share_ids}))
            .on('error', failure.bind(null, obj))
            .end(function(res) {
                if (res.ok) {
                    obj = res.body;
                    success(obj);
                } else {
                    failure(obj);
                }
            });
        // var rawShares = JSON.parse(localStorage.getItem('shares'));

        // _.forEach(rawShares, function(share){
        //     _.forEach(share_ids, function(share_id){
        //         if(share.id === share_id){
        //             share.isNew = false;
        //         }
        //     });
        // });
        // localStorage.setItem('shares', JSON.stringify(rawShares)) || [];
        // setTimeout(function() {
        //     success(share_ids);
        // }, 0);
    },

};
