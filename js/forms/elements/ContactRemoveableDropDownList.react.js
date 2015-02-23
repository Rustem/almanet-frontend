var _ = require('lodash');

var React = require('react/addons');
var utils = require('../../utils');
var inputs = require('../input');
var RemoveableDropDownListWidget = inputs.RemoveableDropDownListWidget;

var FormElementMixin = require('../FormElementMixin.react');
var ContactStore = require('../../stores/ContactStore');

var ContactRemoveableDropDownList = React.createClass({
    mixins : [FormElementMixin],

    renderContact: function(c) {
        return c.vcard.fn;
    },

    buildProps: function() {
        var object_list = ContactStore.getByDate();
        if(this.props.excludeCompanies)
            object_list = _.filter(object_list, function(ob){
                return !utils.isCompany(ob);
            });
        return {
            object_list: object_list,
            object_key: 'id',
            selected_object_keys: this.value() || [],
            object_val: this.renderContact,
            renderSelectedItem: this.renderSelectedItem
        }
    },

    renderSelectedItem: function(object){
        return (
            <div className="row-body">
                {object.vcard.fn}
            </div>
        )
    },

    findByKey: function(key) {
        return ContactStore.get(key);
    },

    onAdd: function(contact_id) {
        var selected_contacts = this.value() || [];
        selected_contacts.push(contact_id);
        var updValue = this.prepValue(this.props.name, _.uniq(selected_contacts));
        return this.updateValue(updValue);
    },

    onRemove: function(contact_id) {
        var selected_contacts = this.value();
        _.pull(selected_contacts, contact_id);
        return this.updateValue(selected_contacts);
    },

    render: function() {
        var props = _.extend({}, this.buildProps(), this.props);
        return <RemoveableDropDownListWidget {...props}
                    onAdd={this.onAdd} onRemove={this.onRemove} />
    }

});

module.exports = ContactRemoveableDropDownList;
