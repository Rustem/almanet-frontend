var _ = require('lodash');
var React = require('react');
var Form = require('./Form.react');
var FormElementMixin = require('./FormElementMixin.react');
var Fieldset = require('./Fieldset.react');

var inputs = require('./input');
var RemoveableDropDownListWidget = inputs.RemoveableDropDownListWidget;
var ContentEditableInput = inputs.ContentEditableInput;

var ContactStore = require('../stores/ContactStore');
var UserStore = require('../stores/UserStore');

var URL_PREFIX   = require('../constants/CRMConstants').URL_PREFIX;

var DEFAULT_SHARE = {
    note: 'краткое сообщение',
    participants: [],
    contacts: []
};

var ColleaguesRemoveableDropDownList = React.createClass({
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
                        <img src={URL_PREFIX + object.userpic} />
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
                    onAdd={this.onAdd} onRemove={this.onRemove} modal={true}/>
    }
});


var ContactShareForm = React.createClass({

    propTypes: {
        onHandleSubmit: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        contact_ids: React.PropTypes.array,
        current_user: React.PropTypes.object
    },

    render: function() {
        var form_value = _.extend({}, DEFAULT_SHARE, {
            'contacts': this.props.contact_ids,
            'participants': [],
            'note': 'причина'
        });
        return (
            <Form ref="contact_share_form"
                  value={form_value}
                  onSubmit={this.onHandleSubmit}>
                <Fieldset className="input-addComment">
                    <ContentEditableInput
                        name='note'
                        className="input-div input-div--addComment" />
                </Fieldset>
                <ColleaguesRemoveableDropDownList
                    name="participants"
                    title="Коллеги"
                    filter_placeholder="Добавить коллегу" />

                <div className="modal-inputLine text-center">
                  <button type="submit" className="text-good">СОХРАНИТЬ</button>
                  <div className="space-horizontal"></div>
                  <button type="cancel" className="text-bad">ОТМЕНА</button>
                </div>
            </Form>
        );
    },

    onHandleSubmit: function(e) {
        e.preventDefault();
        var form = this.refs.contact_share_form;
        var errors = form.validate();
        if(!errors) {
            var share = form.value(),
                shares = [];
            for(var i = 0; i<share.participants.length; i++) {
                for(var j = 0; j<share.contacts.length; j++) {
                    shares.push({
                        'share_from': this.props.current_user.crm_user_id,
                        'share_to': share.participants[i],
                        'contact': share.contacts[j],
                        'note': share.note});
                }
            }

            this.props.onHandleSubmit({shares: shares});
        } else{
            alert(errors);
        }
        return false;
    },

});

module.exports = ContactShareForm;
