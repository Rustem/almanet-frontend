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
var ContactStore = require('../stores/ContactStore');
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

  createShare: function(contact_id, note) {
    var object = {'contact_id': contact_id, 'note': note};
    dispatcher.handleViewAction({
      type: ActionTypes.CREATE_SHARE,
      object: object
    });
    // var message = ContactStore.getCreatedContact(shareObject);
    ContactWebAPI.createShare(object, function(contact){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SHARE_SUCCESS,
        object: contact
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SHARE_FAIL,
        error: error
      })
    }.bind(this));
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
