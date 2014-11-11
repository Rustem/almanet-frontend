var keyMirror = require('react/lib/keyMirror');


module.exports = {
    ActionTypes: keyMirror({
        CREATE_CONTACT: null,
        RECEIVE_CREATED_CONTACT: null,
        CREATE_SHARE: null,
        RECEIVE_CREATED_SHARE: null,

    }),
    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),
    ContactViews: {

    }
}
