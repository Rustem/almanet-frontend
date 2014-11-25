var React = require('react/addons');
var cx            = React.addons.classSet;
var cloneWithProps = React.addons.cloneWithProps;
var Form = require('./Form.react');
var FormElementMixin = require('./FormElementMixin.react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var DropDownBehaviour = require('./mixins').DropDownBehaviour;
var IconSvg = require('../components/common/IconSvg.react');


var NOTE_TEMPLATES = [
    ['Написал клиенту по почте', 'Пример 1: Написал клиенту по почте'],
    ['Договорились с клиентом о встрече в пятницу', 'Пример 2: Договорились с клиентом о встрече в пятницу'],
    ['Позвонил клиенту. Он согласился.', 'Пример 3: Позвонил клиенту. Он согласился.']
];

var DEFAULT_ACTIVITY = {
    'description': "Напишите комментарий",
    'feedback': 'waiting'
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
                    Кликните, чтобы выбрать тип события
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

var RemoveableDropDownList = React.createClass({

    propTypes: {
        list: React.PropTypes.array.isRequired,
        key: React.PropTypes.string.isRequired,
    },

    render: function() {
        return (
            <div/>)
    }

});

var AddActivityForm = React.createClass({

    propTypes: {
        onHandleSubmit: React.PropTypes.func
    },

    render: function() {
        return (
            <Form {...this.props} value={DEFAULT_ACTIVITY}
                                  ref="add_event_form"
                                  onSubmit={this.onHandleSubmit}>
                <InputWithDropdown name="description" choices={NOTE_TEMPLATES} />
                <FeedbackDropDown name="feedback" choices={FEEDBACK_STATUSES} />
                <hr className="text-neutral" />
                <RemoveableDropDownList
                    name="contacts"
                    list=[] key="" />

            </Form>
        );
    },

    onHandleSubmit: function(value) {
        console.log("add Event");
    }

});

module.exports = AddActivityForm;
