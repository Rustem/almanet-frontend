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

var moment = require('moment');
var NotifTypes = require('./constants/CRMConstants').NotifTypes;

module.exports = {

  init: function() {
    localStorage.setItem('users', JSON.stringify([
      {
        id: 'u_1',
        email: 'sanzhar@altayev.kz ',
        first_name: 'Санжар',
        last_name: 'Алтаев',
        userpic: 'sanzhar.png'
      },
      {
        id: 'u_2',
        email: 'mailubai@gmail.com',
        first_name: 'Ернар',
        last_name: 'Майлюбаев',
        userpic: 'abish.png'
      },
      {
        id: 'u_3',
        email: 'sattar94@outlook.com',
        first_name: 'Данияр',
        last_name: 'Мусакулов',
        userpic: 'sanzhar.png'
      },
      {
        id: 'u_4',
        email: 'vadim@v3na.kz',
        first_name: 'Вадим',
        last_name: 'Котов',
        userpic: 'abish.png'
      },

    ]));

    localStorage.setItem('products', JSON.stringify([
      {
        id: 'prod_1',
        name: '1C Online',
        description: '1C Online accounting system By AlmaCloud',
        price: '3000',
        currency: 'KZT',
      },
      {
        id: 'prod_2',
        name: 'Office 365',
        description: 'Microsoft Office 365',
        price: '5000',
        currency: 'KZT',
      },
      {
        id: 'prod_3',
        name: 'Altel 4g',
        description: 'Unlim Internet by Altel',
        price: '4500',
        currency: 'KZT',
      },
    ]));

    // localStorage.setItem('notifications', JSON.stringify([
    //   {
    //     id: 'n_1',
    //     type: NotifTypes.CONTACT_CREATE,
    //     author_id: 'u_1',
    //     at: moment("2014-12-13 11:02:15"),
    //     is_new: true,
    //     extra: {contact_id: 'c_1417332567250'}
    //   },
    //   {
    //     id: 'n_2',
    //     type: NotifTypes.CONTACT_UPDATE,
    //     author_id: 'u_1',
    //     at: moment("2014-12-14 17:02:15"),
    //     is_new: true,
    //     extra: {contact_id: 'c_1417332567250'}
    //   },
    // ]));
  }

};
