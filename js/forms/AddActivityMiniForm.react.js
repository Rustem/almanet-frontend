var _ = require('lodash');
var React = require('react/addons');
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var elements = require('./elements');
var InputWithDropDown = elements.InputWithDropDown;
var FeedbackDropDown = elements.FeedbackDropDown;
var DropDownBehaviour = require('./behaviours').DropDownBehaviour;

// TODO: probably replace it to constants or get remotely (repeat in forms/AddActivityForm)
var NOTE_TEMPLATES = [
    ['Написал клиенту по почте', 'Пример 1: Написал клиенту по почте'],
    ['Договорились с клиентом о встрече в пятницу', 'Пример 2: Договорились с клиентом о встрече в пятницу'],
    ['Позвонил клиенту. Он согласился.', 'Пример 3: Позвонил клиенту. Он согласился.']
];

var DEFAULT_ACTIVITY = {
    'description': "Кратко опишите произошедшее",
    'feedback': null,
};

// TODO: probably replace it to constants or get remotely (repeat in forms/AddActivityForm)
var FEEDBACK_STATUSES = [
    ['waiting', 'Ожидание'],
    ['positive', 'Положительный фидбек'],
    ['neutral', 'Нейтральный фидбек'],
    ['negative', 'Негативный фидбек'],
    ['outcome', 'Закрытие сделки'],
]

var AddActivityMiniForm = React.createClass({
    mixins: [FormMixin],
    // propTypes: {
    //     onHandleSubmit: React.PropTypes.func,
    //     onCancel: React.PropTypes.func,
    //     current_user: React.PropTypes.object,
    //     salescycle: React.PropTypes.string
    // },

    render: function() {
        return (
            <Form ref="add_activity_form" value={DEFAULT_ACTIVITY}
                                  onSubmit={this.onHandleSubmit}>
                <InputWithDropDown name="description" choices={NOTE_TEMPLATES} />
                <div className="inputLine-submitComment">
                    <FeedbackDropDown name="feedback" choices={FEEDBACK_STATUSES} simple={true} />
                    <div className="inputLine-submitComment-submit">
                      <button className="btn btn--save" type="submit">Сохранить</button>
                    </div>
                </div>
            </Form>
        );
    },

    onHandleSubmit: function(e) {
        e.preventDefault();
        var form = this.refs.add_activity_form;
        var errors = form.validate();
        if(!errors) {
            var object = {}, formValue = form.value();
            object.author_id = this.props.current_user.id;
            object.description = formValue.description;
            object.feedback = formValue.feedback;
          this.props.onHandleSubmit(object);
        } else{
            alert(errors);
        }
        return false;
    }

});

module.exports = AddActivityMiniForm;
