var keyMirror = require('react/lib/keyMirror');


module.exports = {
    ActionTypes: keyMirror({
        CREATE_CONTACT: null,
        RECEIVE_CREATED_CONTACT: null
    }),
    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),
    ContactViews: {
        SHARED_CONTACT_VIEW: 'shared',
        COLD_BASE_CONTACT_VIEW: 'coldbase',
        get: function(the_view) {
            return the_view + '_view';
        }
    }
}
