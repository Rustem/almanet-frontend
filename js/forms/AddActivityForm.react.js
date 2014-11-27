var _ = require('lodash');
var React = require('react/addons');
var cx            = React.addons.classSet;
var cloneWithProps = React.addons.cloneWithProps;
var Form = require('./Form.react');
var FormElementMixin = require('./FormElementMixin.react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var RemoveableDropDownListWidget = inputs.RemoveableDropDownListWidget;
var DropDownBehaviour = require('./behaviours').DropDownBehaviour;
var IconSvg = require('../components/common/IconSvg.react');
var Fieldset = require('./Fieldset.react');
var ContactStore = require('../stores/ContactStore');
var UserStore = require('../stores/UserStore');


var NOTE_TEMPLATES = [
    ['Написал клиенту по почте', 'Пример 1: Написал клиенту по почте'],
    ['Договорились с клиентом о встрече в пятницу', 'Пример 2: Договорились с клиентом о встрече в пятницу'],
    ['Позвонил клиенту. Он согласился.', 'Пример 3: Позвонил клиенту. Он согласился.']
];

var DEFAULT_ACTIVITY = {
    'description': "Краткое описание",
    'feedback': null,
    'contacts': [],
    'participants': [],
    'salescycle': null,
    'duration': 'ЧЧ:MM'
};
var ESCAPE_KEY_CODE = 27;

var FEEDBACK_STATUSES = [
    ['waiting', 'Ожидание'],
    ['positive', 'Событие с позитивнай реакцией контакта'],
    ['neutral', 'Событие с нейтральной реакцией контакта'],
    ['negative', 'Событие с негативная реакцией контакта'],
    ['outcome', 'Результат'],
]

var DescriptionDropDownWidget = React.createClass({
    mixins: [DropDownBehaviour],
    propTypes: {
        choices: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    renderChoice: function(choice, idx) {
        return (
            <li>
                <a key={'choice__' + idx} onClick={this.onChoice.bind(null, idx)} className="dropdown-menu-link">
                   {choice[1]}
                </a>
            </li>
        );
    },

    render: function() {
        var className = cx({
            'dropdown': true,
            'open': this.state.isOpen
        });
        return (
            <div className={className}>
                <button ref="menuToggler" onKeyDown={this.onKeyDown} onClick={this.onMenuToggle} type="button" className="row row--oneliner row--dropdown">
                    <div className="row-body">
                        <div className="row-body-primary">
                            Или выберите из шаблона
                        </div>
                        <div className="row-body-secondary">
                            <div className="row-icon">
                                <IconSvg iconKey="arrow-down" />
                            </div>
                        </div>
                    </div>
                </button>
                <div className="dropdown-menu dropdown-menu--wide">
                    <div className="dropdown-menu-body">
                        <ul className="dropdown-menu-list">
                            {this.props.choices.map(this.renderChoice)}
                        </ul>
                    </div>
                </div>
          </div>
        );
    }

});

var SalesCycleDropDownWidget = React.createClass({
    mixins: [DropDownBehaviour],

    propTypes: {
        choices: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    getChoice: function(key) {
        for(var i = 0; i<this.props.choices.length; i++) {
            var choice = this.props.choices[i];
            if(choice[0] === key) {
                return choice
            }
        }
        return null;
    },

    renderChoice: function(choice, idx) {
        return (
            <a key={'choice__' + idx} ref={'fb_choice__' + choice[0]} onClick={this.onChoice.bind(null, idx)}  className="row row--oneliner row--link">
                <div className="row-icon text-good">
                    <IconSvg iconKey={choice[0]} />
                </div>
                <div className="row-body text-secondary">
                  {choice[1]}
                </div>
            </a>
        )
    },

    render: function() {
        var className = cx({
            'dropdown': true,
            'open': this.state.isOpen
        });
        if(this.props.value){
            var salesCycle = this.getChoice(this.props.value)[1];
        }
        else {
            var salesCycle = null;
        }
        return (
            <div className={className}>
                <button ref="menuToggler" onKeyDown={this.onKeyDown} onClick={this.onMenuToggle} type="button" className="row row--oneliner row--dropdown">
                    <div className="row-body-primary">{salesCycle || "Выберите цикл продаж"}</div>
                    <div className="row-body-secondary">
                        <div className="row-icon">
                            <IconSvg iconKey="arrow-down" />
                        </div>
                      </div>
                </button>
                <div className="dropdown-menu dropdown-menu--wide">
                    {this.props.choices.map(this.renderChoice)}
                </div>
            </div>
        )
    }
});

var FeedbackDropDownWidget = React.createClass({
    mixins: [DropDownBehaviour],

    propTypes: {
        choices: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    renderChoice: function(choice, idx) {
        return (
            <a key={'choice__' + idx} ref={'fb_choice__' + choice[0]} onClick={this.onChoice.bind(null, idx)}  className="row row--oneliner row--link">
                <div className="row-icon text-good">
                    <IconSvg iconKey={choice[0]} />
                </div>
                <div className="row-body text-secondary">
                  {choice[1]}
                </div>
            </a>
        )
    },

    renderDefaultChoice: function() {
        return (
            <div>
                <div className="row-icon">
                    <IconSvg iconKey="event-type" />
                </div>
                <div className="row-body">
                    Выбрать статус
                </div>
            </div>
        )
    },

    copyRenderedChoice: function() {
        var value = this.props.value,
            idx = -1, choice = null;
        for(var i = 0; i<this.props.choices.length; i++) {
            var cur = this.props.choices[i];
            if(cur[0] === value) {
                idx = i;
                choice = cur;
                break;
            }
        }
        return (
            <a key={'choice__' + idx} className="row row--oneliner row--link">
                <div className="row-icon text-good">
                    <IconSvg iconKey={choice[0]} />
                </div>
                <div className="row-body text-secondary">
                  {choice[1]}
                </div>
            </a>
        )
    },

    render: function() {
        var className = cx({
            'dropdown': true,
            'open': this.state.isOpen
        });
        return (
            <div className={className}>
                <button ref="menuToggler" onKeyDown={this.onKeyDown} onClick={this.onMenuToggle} type="button" className="row row--oneliner row--dropdown">
                    {this.props.value && this.copyRenderedChoice() || this.renderDefaultChoice()}
                </button>
                <div className="dropdown-menu dropdown-menu--wide">
                    {this.props.choices.map(this.renderChoice)}
                </div>
            </div>
        )
    }
});


var InputWithDropdown = React.createClass({
    mixins : [FormElementMixin],
    propTypes: {
        choices: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        return {
            isOpen: false
        }
    },

    onUpdate: function(val) {
        console.log('value', val);
    },

    render: function() {
        var value = this.value();

        return (
            <div className="input-addComment">
                <ContentEditableInput
                    ref="target_input"
                    name={this.props.name}
                    onValueUpdate={this.onUpdate}
                    className="input-div--addComment" />
                <DescriptionDropDownWidget choices={this.props.choices}
                                onChange={this.onDropDownChange} />
            </div>
        )
    },

    onDropDownChange: function(choice_idx, choice) {
        this.updateValue(this.prepValue(this.props.name, choice[0]));
    },
});

var FeedbackDropDown = React.createClass({
    mixins: [FormElementMixin],

    onChange: function(choice_idx, choice) {
        this.updateValue(this.prepValue(this.props.name, choice[0]));
    },

    render: function() {
        return (
            <div className="modal-inputLine">
                <FeedbackDropDownWidget value={this.value()} choices={FEEDBACK_STATUSES}
                                        onChange={this.onChange} />
            </div>
        )
    }
});



var ContactRemoveableDropDownList = React.createClass({

    mixins : [FormElementMixin],

    renderContact: function(c) {
        return c.fn;
    },

    buildProps: function() {
        return {
            object_list: ContactStore.getByDate(),
            object_key: 'id',
            selected_object_keys: this.value() || [],
            object_val: this.renderContact,
            renderSelectedItem: this.renderSelectedItem
        }
    },

    renderSelectedItem: function(object){
        return (
            <div className="row-body">
                {object.fn}
            </div>
        )
    },

    findByKey: function(key) {
        return ContactStore.get(key);
    },

    onAdd: function(contact_id) {
        var selected_contacts = this.value();
        selected_contacts.push(contact_id);
        var updValue = this.prepValue(this.props.name, _.unique(selected_contacts));
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

var ParticipantRemoveableDropDownList = React.createClass({
    mixins : [FormElementMixin],

    renderUser: function(u) {
        return u.first_name + " " + u.last_name;
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
                <div className="row-body">{object.first_name + " " + object.last_name}</div>
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

var SalesCycleDropDownList = React.createClass({
    mixins: [FormElementMixin],

    onChange: function(choice_idx, choice) {
        this.updateValue(this.prepValue(this.props.name, choice[0]));
    },

    buildChoices: function() {
        return [[1, 'Sales Cycle 1'],
                [2, 'Sales Cycle 2']];
    },

    render: function() {
        return (
            <div className="modal-inputLine">
                <SalesCycleDropDownWidget
                    value={this.value()}
                    choices={this.buildChoices()}
                    onChange={this.onChange} />
                <div class="inputLine-caption">
                Если не изменять значение, событие попадет в основной поток
                </div>
            </div>
        )
    }
});

var AddActivityForm = React.createClass({

    propTypes: {
        onHandleSubmit: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        contact_ids: React.PropTypes.array,
        current_user: React.PropTypes.object
    },

    render: function() {
        var form_value = _.extend({}, DEFAULT_ACTIVITY, {
            'contacts': this.props.contact_ids,
            'participants': [this.props.current_user.id]});
        return (
            <Form {...this.props} value={form_value}
                                  ref="add_event_form"
                                  onSubmit={this.onHandleSubmit}>
                <InputWithDropdown name="description" choices={NOTE_TEMPLATES} />
                <FeedbackDropDown name="feedback" choices={FEEDBACK_STATUSES} />
                <hr className="text-neutral" />
                <ContactRemoveableDropDownList
                    name="contacts"
                    title="Клиенты"
                    filter_placeholder="Добавить клиента" />
                <hr className="text-neutral" />
                <SalesCycleDropDownList name="salescycle" />
                <hr className="text-neutral" />
                <ParticipantRemoveableDropDownList
                    name="participants"
                    title="Коллеги"
                    filter_placeholder="Добавить коллегу" />
                <hr className="text-neutral" />
                <Fieldset className="modal-inputLine">
                  <strong>Длительность</strong>
                  <ContentEditableInput {...this.props} name="duration" />
                </Fieldset>
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
        var form = this.refs.add_event_form;
        var errors = form.validate();
        if(!errors) {
          this.props.onHandleSubmit(form.value());
        } else{
            alert(errors);
        }
        return false;
    }

});

module.exports = AddActivityForm;
