var _ = require('lodash');

var VCardProcessingBehaviour = {
    preValue: function(value) {
        value.vcard.tp = value.tp;
        return _.omit(value, 'tp');
    },

    postValue: function(value) {
        value.tp = value.vcard.tp;
        value.vcard = _.omit(value.vcard, 'tp');
        value.user_id = this.getUser().crm_user_id;
        return value;
    },

    removeEmpty: function(value) {
        value.vcard = _.mapValues(value.vcard, function(value, key) { 
            return this.cutEmptyFields(value, key) 
        }.bind(this));
        return value;
    },

    cutEmptyFields: function(value, key) {
      switch(key) {
        case 'emails':
            _.remove(value, function(v) { return v.value == undefined });
            break;
        case 'tels':
            _.remove(value, function(v) { return v.value == undefined });
            break;
        case 'urls':
            _.remove(value, function(v) { return v.value == undefined });
            break;
        case 'adrs':
            _.remove(value, function(v) { 
                return v.street_address == undefined && 
                       v.locality == undefined && 
                       v.region == undefined && 
                       v.country_name == undefined && 
                       v.postal_code == undefined }
            );
            break;
        default:
            break;
      }
      return value
    },

};

module.exports = VCardProcessingBehaviour;
