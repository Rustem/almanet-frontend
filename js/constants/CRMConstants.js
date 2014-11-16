var keyMirror = require('react/lib/keyMirror');


module.exports = {
    ActionTypes: keyMirror({
        CREATE_CONTACT: null,
        RECEIVE_CREATED_CONTACT: null,
        RECEIVE_READ_SHARES: null,
        CREATE_SHARE: null,
        RECEIVE_CREATED_SHARE: null,
        CURRENT_USER_LOADED: null,
        LOGOUT: null,

    }),
    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),
    ContactViews: {

    }
}
