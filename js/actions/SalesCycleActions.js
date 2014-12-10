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
var SalesCycleWebAPI = require('../api/SalesCycleWebAPI');
// var ShareStore = require('../stores/ShareStore');
var ActionTypes = CRMConstants.ActionTypes;
var utils = require('../utils');
module.exports = {

  close: function(object) {
    dispatcher.handleViewAction({
      type: ActionTypes.CLOSE_SALES_CYCLE,
      object: object
    });
    SalesCycleWebAPI.close(object, function(salesCycle){
      dispatcher.handleServerAction({
        type: ActionTypes.CLOSE_SALES_CYCLE_SUCCESS,
        object: salesCycle
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.CLOSE_SALES_CYCLE_FAIL,
        error: error
      });
    }.bind(this));
  },

  create: function(object) {
    dispatcher.handleViewAction({
      type: ActionTypes.CREATE_SALES_CYCLE,
      object: object
    });
    SalesCycleWebAPI.create(object, function(salesCycle){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SALES_CYCLE_SUCCESS,
        object: salesCycle
      });
    }.bind(this), function(error){
      dispatcher.handleServerAction({
        type: ActionTypes.CREATE_SALES_CYCLE_FAIL,
        error: error
      });
    }.bind(this));
  },



};
