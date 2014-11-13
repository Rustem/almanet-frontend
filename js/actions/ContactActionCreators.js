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

var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ContactWebAPI = require('../api/ContactWebAPI');
var ContactStore = require('../stores/ContactStore');

var ActionTypes = CRMConstants.ActionTypes;

module.exports = {

  createContact: function(object) {
    CRMAppDispatcher.handleViewAction({
      type: ActionTypes.CREATE_CONTACT,
      object: object
    });
    // var message = ContactStore.getCreatedContact(object);
    ContactWebAPI.createContact(object);
  },

  createShare: function(contact_id, note) {
    var object = {'contact_id': contact_id, 'note': note};
    CRMAppDispatcher.handleViewAction({
      type: ActionTypes.CREATE_SHARE,
      object: object
    });
    // var message = ContactStore.getCreatedContact(shareObject);
    ContactWebAPI.createShare(object);
  }

};
