var _ = require('lodash');

this.DEFAULT_ENV = {
    "Almanet": {
        "URL_PREFIX": "http://alma.net:8000",
        "LOGOUT_URL": "http://alma.net:8000/auth/logout/"
    }
};

this.DEMO_ENV = {
    "Almanet": {
        "URL_PREFIX": "http://almasales.kz",
        "LOGOUT_URL": "http://almasales.kz/auth/logout/"
    }
};

this.STAGE_ENV = {
    "Almanet": {
        "URL_PREFIX": "http://almasales.kz:3082",
        "LOGOUT_URL": "http://almasales.kz:3082/auth/logout/"
    }  
}


var loadConfig = function (env) {
    var env_attr = env.toUpperCase() + '_ENV';
    return this[env_attr]['Almanet'];
}.bind(this);

module.exports = (function() {
    var cur_env = process.env.NODE_ENV,
        file_name = null,
        config = {};
    if(cur_env === undefined || cur_env === 'dev') {
        cur_env = 'default';
    }
    config = _.extend(config, loadConfig(cur_env))
    return config
}.bind(this)());
