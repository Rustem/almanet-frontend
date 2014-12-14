var React = require('react');

var AppContextMixin = {
    contextTypes: {
        isAuth: React.PropTypes.bool,
        user: React.PropTypes.object,
        toggleNotifCenter: React.PropTypes.func
    },

    getUser: function() {
        return this.context.user;
    },

    isAuth: function() {
        return this.context.isAuth
    },
};

module.exports = AppContextMixin;
