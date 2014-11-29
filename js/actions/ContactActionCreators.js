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
var ShareStore = require('../stores/ShareStore');
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
    // var message = ContactStore.getCreatedContact(shareObject);
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

  createShares: function(shares) {
    for(var i = 0; i<shares.length; i++) {
      this.createShare(shares[i]);
    }
  },

  markAllSharesAsRead: function() {
    var shares_ids = utils.extractIds(ShareStore.getAllNew());
    dispatcher.handleViewAction({
      type: ActionTypes.MARK_SHARES_READ,
      object: shares_ids
    });
    ContactWebAPI.markSharesAsRead(shares_ids, function(marked_share_ids){
      dispatcher.handleServerAction({
        type: ActionTypes.MARK_SHARES_READ_SUCCESS,
        object: marked_share_ids
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.MARK_SHARES_READ_FAIL,
        error: error
      });
    }.bind(this));
  },

};
