/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ContactWebAPI = require('../api/ContactWebAPI');
var ActionTypes = CRMConstants.ActionTypes;
var utils = require('../utils');
module.exports = {

  createContact: function(object) {
    dispatcher.handleViewAction({
      type: ActionTypes.CREATE_CONTACT,
      object: object
    });
    ContactWebAPI.createContact(object, function(contact){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_CONTACT_SUCCESS,
        object: contact
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_CONTACT_FAIL,
        error: error
      });
    }.bind(this));
  },

  importFromVC: function(form_data) {
    dispatcher.handleViewAction({
      type: ActionTypes.IMPORT_CONTACTS,
      object: form_data
    });
    ContactWebAPI.importContacts(form_data, function(contacts){
      dispatcher.handleServerAction({
        type: ActionTypes.IMPORT_CONTACTS_SUCCESS,
        object: contacts
      });
    }.bind(this), function(error) {
      dispatcher.handleServerAction({
        type: ActionTypes.IMPORT_CONTACTS_FAIL,
        error: error
      });
    }.bind(this));
  },

  editContact: function(contact_id, contact) {
    var details = {contact_id: contact_id, contact: contact};
    dispatcher.handleViewAction({
      type: ActionTypes.EDIT_CONTACT,
      object: details
    });
    ContactWebAPI.editContact(details, function(object){
      dispatcher.handleServerAction({
        type: ActionTypes.EDIT_CONTACT_SUCCESS,
        object: object
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.EDIT_CONTACT_FAIL,
        error: error
      });
    }.bind(this));
  },

  setLeads: function(contact_ids){
    dispatcher.handleViewAction({
      type: ActionTypes.MARK_CONTACTS_AS_LEAD,
      object: contact_ids
    });
    ContactWebAPI.setLeads(contact_ids, function(result){
      dispatcher.handleServerAction({
        type: ActionTypes.MARK_CONTACTS_AS_LEAD_SUCCESS,
        object: result
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.MARK_CONTACTS_AS_LEAD_FAIL,
        error: error
      })
    }.bind(this));
  },

  createShare: function(shareObj) {
    dispatcher.handleViewAction({
      type: ActionTypes.CREATE_SHARE,
      object: shareObj
    });
    ContactWebAPI.createShare(shareObj, function(share){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SHARE_SUCCESS,
        object: share
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SHARE_FAIL,
        error: error
      })
    }.bind(this));
  },

  updateNewStatus: function() {
    ContactWebAPI.updateNewStatus(function(upd){
      dispatcher.handleViewAction({
        type: ActionTypes.CONTACT_UPDATE_NEW_STATUS,
        object: {update_info: upd}
      });
    }.bind(this));
  },

  createShares: function(shares) {
    dispatcher.handleViewAction({
      type: ActionTypes.CREATE_SHARE,
      object: shares
    });
    ContactWebAPI.createShare(shares, function(share_objects){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SHARE_SUCCESS,
        object: share_objects
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SHARE_FAIL,
        error: error
      })
    }.bind(this));
  },

  markSharesAsRead: function(shares) {
    var shares_ids = utils.extractIds(shares);
    dispatcher.handleViewAction({
      type: ActionTypes.MARK_SHARES_READ,
      object: shares_ids
    });
    ContactWebAPI.markSharesAsRead(shares_ids, function(shares){
      dispatcher.handleServerAction({
        type: ActionTypes.MARK_SHARES_READ_SUCCESS,
        object: shares
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.MARK_SHARES_READ_FAIL,
        error: error
      });
    }.bind(this));
  },

};
