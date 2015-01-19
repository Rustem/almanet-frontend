var keyMirror = require('react/lib/keyMirror');
var config = require('../../config');

module.exports = {
    ActionTypes: keyMirror({
        APP_LOAD_SUCCESS: null,
        CREATE_CONTACT: null,
        CREATE_CONTACT_SUCCESS: null,
        CREATE_CONTACT_FAIL: null,
        EDIT_CONTACT: null,
        EDIT_CONTACT_SUCCESS: null,
        EDIT_CONTACT_FAIL: null,
        IMPORT_CONTACTS: null,
        IMPORT_CONTACTS_SUCCESS: null,
        IMPORT_CONTACTS_FAIL: null,
        MARK_CONTACTS_AS_LEAD: null,
        MARK_CONTACTS_AS_LEAD_SUCCESS: null,
        MARK_CONTACTS_AS_LEAD_FAIL: null,
        CREATE_SHARE: null,
        CREATE_SHARE_SUCCESS: null,
        CREATE_SHARE_FAIL: null,
        CREATE_ACTIVITY : null,
        CREATE_ACTIVITY_SUCCESS : null,
        CREATE_ACTIVITY_FAIL: null,
        ACTIVITY_MARK_AS_READ: null,
        MARK_SHARES_READ: null,
        MARK_SHARES_READ_SUCCESS: null,
        MARK_SHARES_READ_FAIL: null,
        LOAD_CURRENT_USER: null,
        LOAD_CURRENT_USER_SUCCESS: null,
        LOAD_CURRENT_USER_FAIL: null,
        CLOSE_SALES_CYCLE: null,
        CLOSE_SALES_CYCLE_SUCCESS: null,
        CLOSE_SALES_CYCLE_FAIL: null,
        CREATE_SALES_CYCLE: null,
        CREATE_SALES_CYCLE_SUCCESS: null,
        ADD_PRODUCT_TO_SALES_CYCLE: null,
        ADD_PRODUCT_TO_SALES_CYCLE_SUCCESS: null,
        ADD_PRODUCT_TO_SALES_CYCLE_FAIL: null,
        USER_READ_NOTIFICATION: null,
        USER_READ_NOTIFICATION_SUCCESS: null,
        USER_READ_NOTIFICATION_FAIL: null,
        CREATE_PRODUCT: null,
        CREATE_PRODUCT_SUCCESS: null,
        CREATE_PRODUCT_FAIL: null,
        EDIT_PRODUCT: null,
        EDIT_PRODUCT_SUCCESS: null,
        EDIT_PRODUCT_FAIL: null,
        CREATE_NOTIFICATION: null,
        CREATE_NOTIFICATION_SUCCESS: null,
        CREATE_NOTIFICATION_FAIL: null,
        TOGGLE_FOLLOWING: null,
        TOGGLE_FOLLOWING_SUCCESS: null,
        TOGGLE_FOLLOWING_FAIL: null,
        CREATE_COMMENT: null,
        CREATE_COMMENT_SUCCESS: null,
        CREATE_COMMENT_FAIL: null,
        LOAD_ACTIVITY_COMMENTS: null,
        LOAD_ACTIVITY_COMMENTS_SUCCESS: null,
        LOAD_ACTIVITY_COMMENTS_FAIL: null,
        CREATE_FILTER: null,
        CREATE_FILTER_SUCCESS: null,
        CREATE_FILTER_FAIL: null,
        EDIT_FILTER: null,
        EDIT_FILTER_SUCCESS: null,
        EDIT_FILTER_FAIL: null,
        DELETE_FILTER: null,
        DELETE_FILTER_SUCCESS: null,
        DELETE_FILTER_FAIL: null,
        EDIT_USER: null,
        EDIT_USER_SUCCESS: null,
        LOGOUT: null,
    }),
    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),
    CONTACT_VIEW_MODE: keyMirror({
        EDIT: null,
        READ: null
    }),
    PRODUCT_VIEW_MODE: keyMirror({
        EDIT: null,
        READ: null
    }),
    GLOBAL_SALES_CYCLE_ID: null,
    GLOBAL_SALES_CYCLE: null,
    // TODO: should be retrived from server
    CONTACT_TYPES: {
        CO: 'co',
        USER: 'user',
    },
    NotifTypes: keyMirror({
        CONTACT_CREATE: null,
        CONTACT_EDIT: null,
        CONTACT_SHARE: null,
        ACTIVITY_CREATE: null,
        FILTER_CREATE: null,
        FILTER_EDIT: null,
        IMPORT_CONTACTS: null,
    }),
    SERVICES: keyMirror({
        crm: null
    })
}

console.log(config)
module.exports.URL_PREFIX = require('superagent-prefix')(config['URL_PREFIX']);
module.exports.LOGOUT_URL = config['URL_PREFIX'] + '/auth/logout/'
