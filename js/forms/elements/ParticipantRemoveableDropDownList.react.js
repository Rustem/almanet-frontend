var _ = require('lodash');

var React = require('react/addons');
var inputs = require('../input');
var RemoveableDropDownListWidget = inputs.RemoveableDropDownListWidget;

var FormElementMixin = require('../FormElementMixin.react');
var UserStore = require('../../stores/UserStore');

var ParticipantRemoveableDropDownList = React.createClass({
    mixins : [FormElementMixin],

    renderUser: function(u) {
        return u.vcard.fn;
    },

    buildProps: function() {
        return {
            object_list: UserStore.getAll(),
            object_key: 'id',
            selected_object_keys: this.value() || [],
            object_val: this.renderUser,
            renderSelectedItem: this.renderSelectedItem
        }
    },

    renderSelectedItem: function(object) {
        return (
            <div className="row-body">
                <div className="row-icon">
                    <figure className="icon-userpic">
                        <img src={"img/userpics/" + object.userpic} />
                    </figure>
                </div>
                <div className="row-body">{object.vcard.fn}</div>
            </div>
        )
    },

    findByKey: function(key) {
        return UserStore.get(key);
    },

    onAdd: function(user_id) {
        var selected_users = this.value();
        selected_users.push(user_id);
        var updValue = this.prepValue(this.props.name, _.unique(selected_users));
        return this.updateValue(updValue);
    },

    onRemove: function(user_id) {
        var selected_users = this.value();
        _.pull(selected_users, user_id);
        return this.updateValue(selected_users);
    },

    render: function() {
        var props = _.extend({}, this.buildProps(), this.props);
        return <RemoveableDropDownListWidget {...props}
                    onAdd={this.onAdd} onRemove={this.onRemove} />
    }
});

module.exports = ParticipantRemoveableDropDownList;