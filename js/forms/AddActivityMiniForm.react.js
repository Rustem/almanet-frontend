var _ = require('lodash');
var React = require('react/addons');
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var SalesCycleStore = require('../stores/SalesCycleStore');
var elements = require('./elements');
var Fieldset = require('./Fieldset.react');
var InputWithDropDown = elements.InputWithDropDown;
var FeedbackDropDown = elements.FeedbackDropDown;
var utils = require('../utils');

var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;


// TODO: probably replace it to constants or get remotely (repeat in forms/AddActivityForm)
var NOTE_TEMPLATES = [
    ['Написал клиенту по почте', 'Пример 1: Написал клиенту по почте'],
    ['Договорились с клиентом о встрече в пятницу', 'Пример 2: Договорились с клиентом о встрече в пятницу'],
    ['Позвонил клиенту. Он согласился.', 'Пример 3: Позвонил клиенту. Он согласился.']
];

var AddActivityMiniForm = React.createClass({
    mixins: [FormMixin],
    propTypes: {
        onHandleSubmit: React.PropTypes.func,
        current_user: React.PropTypes.object,
        sales_cycle_id: React.PropTypes.number
    },

    render: function() {
        return (
            <Form ref="add_activity_form"
                                  onSubmit={this.onHandleSubmit}>
                <InputWithDropDown name="description" choices={NOTE_TEMPLATES} placeholder="Кратко опишите произошедшее" />
                <Fieldset className="inputLine-submitComment">
                    <FeedbackDropDown name="feedback_status" simple={true} />
                    <div className="inputLine-submitComment-submit">
                      <button className="btn btn--save" type="submit">Сохранить</button>
                    </div>
                </Fieldset>
            </Form>
        );
    },

    onHandleSubmit: function(e) {
        e.preventDefault();
        var GLOBAL_SALES_CYCLE_ID = utils.get_constants('global_sales_cycle_id'),
            form = this.refs.add_activity_form,
            errors = form.validate();
        if(!errors) {
            var object = {}, formValue = form.value();
            object.author_id = this.props.current_user.crm_user_id;
            object.sales_cycle_id = this.props.sales_cycle_id;
            object.description = formValue.description;
            object.feedback_status = formValue.feedback_status;
            if(object.sales_cycle_id != GLOBAL_SALES_CYCLE_ID) {
                object.contact_id = SalesCycleStore.get(this.props.sales_cycle_id).contact_id;
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

module.exports = AddActivityMiniForm;
