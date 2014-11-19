var keyMirror = require('react/lib/keyMirror');


module.exports = {
    ActionTypes: keyMirror({
        CREATE_CONTACT: null,
        CREATE_CONTACT_SUCCESS: null,
        CREATE_CONTACT_FAIL: null,
        CREATE_SHARE: null,
        CREATE_SHARE_SUCCESS: null,
        CREATE_SHARE_FAIL: null,
        MARK_SHARES_READ: null,
        MARK_SHARES_READ_SUCCESS: null,
        MARK_SHARES_READ_FAIL: null,
        LOAD_CURRENT_USER: null,
        LOAD_CURRENT_USER_SUCCESS: null,
        LOAD_CURRENT_USER_FAIL: null,
        LOGOUT: null,

    }),
    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),
    ContactViews: {

    }
}
