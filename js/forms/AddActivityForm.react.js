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

var NOTE_TEMPLATES = [
    ['Написал клиенту по почте', 'Пример 1: Написал клиенту по почте'],
    ['Договорились с клиентом о встрече в пятницу', 'Пример 2: Договорились с клиентом о встрече в пятницу'],
    ['Позвонил клиенту. Он согласился.', 'Пример 3: Позвонил клиенту. Он согласился.']
];

var DEFAULT_ACTIVITY = {
    'description': "Краткое описание",
    'feedback_status': null,
    'contact_ids': [],
    'participants': [],
    'sales_cycle_id': null,
    'duration': 'ЧЧ:MM'
};
var ESCAPE_KEY_CODE = 27;

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
                <button ref="menuToggler" type="button" className="row row--oneliner row--dropdown"
                                          onKeyDown={this.onKeyDown}
                                          onClick={this.onMenuToggle}
                                          onBlur={this.onMenuTogglerBlur}>
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

    propTypes: {
        sales_cycles: React.PropTypes.array,
    },

    onChange: function(choice_idx, choice) {
        this.updateValue(this.prepValue(this.props.name, choice[0]));
    },

    render: function() {
        return (
            <div className="modal-inputLine">
                {this.props.sales_cycles.length > 0 
                    ? <SalesCycleDropDownWidget
                        value={this.value()}
                        choices={this.props.sales_cycles}
                        onChange={this.onChange} />
                    : null
                }
                
                <div className="inputLine-caption">
                {this.props.sales_cycles.length > 0 
                    ? "Если не изменять значение, событие попадет в основной поток"
                    : "Взаимодействие попадет в основной поток всем выбранным контактам"
                }
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
        sales_cycle_id: React.PropTypes.number
    },

    getSalesCycles: function() {
        // we need cycles such that:
        // 1) they are open
        // 2) by contact_ids (if several so render nothing in SalesCycleDropDownList, 
        //    but form should distibute activity to their global cycles)

        var cycles = _.flatten(_.map(this.props.contact_ids, function(c_id) {
                return SalesCycleStore.openedByContact(c_id)
            }));
        if(this.props.contact_ids.length === 1)
            return cycles;
        return _.filter(cycles, 'is_global');
    },

    buildSalesCycleChoices: function() {
        if(this.props.contact_ids.length === 1)
            return _.map(this.getSalesCycles(), function(sc) {
                return [sc.id, sc.title]
            });
        return [];
    },

    render: function() {
        var form_value = _.extend({}, DEFAULT_ACTIVITY, {
            'contact_ids': this.props.contact_ids,
            'participants': [this.props.current_user.crm_user_id],
            'sales_cycle_id': this.props.sales_cycle_id});
        return (
            <Form {...this.props} value={form_value}
                                  ref="add_event_form"
                                  onSubmit={this.onHandleSubmit}>
                <InputWithDropDown name="description" choices={NOTE_TEMPLATES} />
                <FeedbackDropDown name="feedback_status" />
                <hr className="text-neutral" />
                <SalesCycleDropDownList name="sales_cycle_id" sales_cycles={this.buildSalesCycleChoices()} />
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
            //     <FeedbackDropDown name="feedback_status" />
            //     <hr className="text-neutral" />
            //     <ContactRemoveableDropDownList
            //         name="contact_ids"
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
        var form = this.refs.add_event_form,
            errors = form.validate();
        if(!errors) {
            var object = {}, formValue = form.value();
            _.forEach(formValue.contact_ids, function(c_id) {
                object.author_id = this.props.current_user.crm_user_id;
                object.description = formValue.description;
                object.feedback_status = formValue.feedback_status;
                object.sales_cycle_id = formValue.sales_cycle_id || SalesCycleStore.getGlobalForContact(c_id).id;
                object.contact_id = c_id;
                
                this.props.onHandleSubmit(object);
            }.bind(this));
        } else{
            alert(errors);
        }
        return false;
    }

});

module.exports = AddActivityForm;
