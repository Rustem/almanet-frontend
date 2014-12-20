var _ = require('lodash');
var React = require('react/addons');
var cx            = React.addons.classSet;
var cloneWithProps = React.addons.cloneWithProps;
var Form = require('./Form.react');
var FormElementMixin = require('./FormElementMixin.react');
var inputs = require('./input');
var elements = require('./elements');
var InputWithDropDown = elements.InputWithDropDown;
var FeedbackDropDown = elements.FeedbackDropDown;
var DropDownBehaviour = require('./behaviours').DropDownBehaviour;
var IconSvg = require('../components/common/IconSvg.react');
var Fieldset = require('./Fieldset.react');
var SalesCycleStore = require('../stores/SalesCycleStore');
var utils = require('../utils');

var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var GLOBAL_SALES_CYCLE_ID = CRMConstants.GLOBAL_SALES_CYCLE_ID;

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

var SalesCycleDropDownList = React.createClass({
    mixins: [FormElementMixin],

    onChange: function(choice_idx, choice) {
        this.updateValue(this.prepValue(this.props.name, choice[0]));
    },

    buildChoices: function() {
        var rv = [], cycles = SalesCycleStore.getAll();
        for(var i = 0; i<cycles.length; i++) {
            rv.push([cycles[i].id, cycles[i].title]);
        }
        return rv;
    },

    render: function() {
        return (
            <div className="modal-inputLine">
                <SalesCycleDropDownWidget
                    value={this.value()}
                    choices={this.buildChoices()}
                    onChange={this.onChange} />
                <div className="inputLine-caption">
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
        current_user: React.PropTypes.object,
        salescycle: React.PropTypes.string
    },

    render: function() {
        var form_value = _.extend({}, DEFAULT_ACTIVITY, {
            'contacts': this.props.contact_ids,
            'participants': [this.props.current_user.id],
            'salescycle': this.props.salescycle});
        return (
            <Form {...this.props} value={form_value}
                                  ref="add_event_form"
                                  onSubmit={this.onHandleSubmit}>
                <InputWithDropDown name="description" choices={NOTE_TEMPLATES} />
                <FeedbackDropDown name="feedback" choices={FEEDBACK_STATUSES} />
                <hr className="text-neutral" />
                <SalesCycleDropDownList name="salescycle" />
                <div className="modal-inputLine text-center">
                  <button type="submit" className="text-good">СОХРАНИТЬ</button>
                  <div className="space-horizontal"></div>
                  <button onClick={this.onHandleCancel} type="cancel" className="text-bad">ОТМЕНА</button>
                </div>
            </Form>
        );
            // <Form {...this.props} value={form_value}
            //                       ref="add_event_form"
            //                       onSubmit={this.onHandleSubmit}>
            //     <InputWithDropDown name="description" choices={NOTE_TEMPLATES} />
            //     <FeedbackDropDown name="feedback" choices={FEEDBACK_STATUSES} />
            //     <hr className="text-neutral" />
            //     <ContactRemoveableDropDownList
            //         name="contacts"
            //         title="Клиенты"
            //         filter_placeholder="Добавить клиента" />
            //     <hr className="text-neutral" />
            //     <SalesCycleDropDownList name="salescycle" />
            //     <hr className="text-neutral" />
            //     <ParticipantRemoveableDropDownList
            //         name="participants"
            //         title="Коллеги"
            //         filter_placeholder="Добавить коллегу" />
            //     <hr className="text-neutral" />
            //     <Fieldset className="modal-inputLine">
            //       <strong>Длительность</strong>
            //       <ContentEditableInput {...this.props} name="duration" />
            //     </Fieldset>
            //     <div className="modal-inputLine text-center">
            //       <button type="submit" className="text-good">СОХРАНИТЬ</button>
            //       <div className="space-horizontal"></div>
            //       <button onClick={this.onHandleCancel} type="cancel" className="text-bad">ОТМЕНА</button>
            //     </div>
            // </Form>
    },

    onHandleCancel: function(e) {
        e.preventDefault();
        this.props.onCancel.call(this);
    },

    onHandleSubmit: function(e) {
        e.preventDefault();
        var form = this.refs.add_event_form;
        var errors = form.validate();
        if(!errors) {
            var object = {}, formValue = form.value();
            object.author_id = this.props.current_user.id;
            object.description = formValue.description;
            object.feedback = formValue.feedback;
            object.salescycle_id = formValue.salescycle;
            if(object.salescycle_id != GLOBAL_SALES_CYCLE_ID) {
                object.contact_id = SalesCycleStore.get(formValue.salescycle).contact_id;
            }
            else {
                object.contact_id = null;
            }
            this.props.onHandleSubmit(object);
        } else{
            alert(errors);
        }
        return false;
    }

});

module.exports = AddActivityForm;
