var _ = require('lodash');
var React = require('react/addons');
var cx            = React.addons.classSet;
var DropDownBehaviour = require('../behaviours').DropDownBehaviour;
var IconSvg = require('../../components/common/IconSvg.react');

var FilterableDropDownWidget = React.createClass({
    mixins: [DropDownBehaviour],

    propTypes: {
        choices: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        filter_placeholder: React.PropTypes.string.isRequired
    },

    renderChoice: function(choice, idx) {
        return (
            <li key={'choice__' + idx}>
                <a onClick={this.onChoice.bind(null, idx)} className="dropdown-menu-link">
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
        var n = this.props.choices.length;
        return (
            <div className={className}>
                <div className="row row--dropdown">
                    <div className="row-icon">
                        <IconSvg iconKey="search" />
                    </div>

                    <div ref="menuToggler"  className="row-body row-body--inverted"
                                            onKeyDown={this.onKeyDown}
                                            onClick={this.onMenuToggle}
                                            onBlur={this.onMenuTogglerBlur}>
                        <div className="row-body-secondary">
                            <div className="row-icon">
                                <IconSvg iconKey="arrow-down" />
                            </div>
                        </div>
                        <div className="row-body-primary row-body-primary--nopad row-body-primary--extraOffset">
                            <div className="input-div input-div--block" contentEditable>{this.props.filter_placeholder}</div>
                        </div>
                    </div>
                </div>
                <div className="dropdown-menu dropdown-menu--wide">
                    <div className="dropdown-menu-body">
                        <ul className="dropdown-menu-list">
                            {this.props.choices.map(this.renderChoice)}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
});


var RemoveableDropDownListWidget = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        filter_placeholder: React.PropTypes.string.isRequired,
        object_list: React.PropTypes.array.isRequired,
        selected_object_keys: React.PropTypes.array.isRequired,
        object_key: React.PropTypes.string.isRequired,
        object_val: React.PropTypes.func.isRequired,
        onAdd: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        renderSelectedItem: React.PropTypes.func.isRequired
    },

    buildChoices: function() {
        var choices = [];
        for(var i = 0; i<this.props.object_list.length; i++) {
            var cur_object = this.props.object_list[i];
            var key_val = cur_object[this.props.object_key];
            choices.push([key_val, this.props.object_val(cur_object)]);
        }
        return choices;
    },

    findObjectByKey: function(key) {
        return _.find(this.props.object_list, function(object){
            return object[this.props.object_key] === key;
        }.bind(this));
    },

    renderSelectedItem: function(object_key) {
        var object = this.findObjectByKey(object_key);
        return (
            <div className="row row--oneliner">
                <div className="row-icon">
                    <button onClick={this.onItemRemove.bind(null, object_key)} type="button">
                        <IconSvg iconKey="remove" />
                    </button>
                </div>
                {this.props.renderSelectedItem(object)}
              </div>
        )
    },

    onItemRemove: function(object_key, evt) {
        evt.preventDefault();
        this.props.onRemove(object_key);
    },

    onItemAdd: function(choice_idx, choice) {
        this.props.onAdd(choice[0]);
    },

    render: function() {
        var is_modal_class_name = this.props.modal ? "modal-inputLine" : "";
        return (
            <section className="hi">
                <div className={is_modal_class_name}>
                    <strong>{this.props.title}</strong>
                    {this.props.selected_object_keys.map(this.renderSelectedItem)}
                </div>
                <div className={is_modal_class_name}>
                    <FilterableDropDownWidget filter_placeholder={this.props.filter_placeholder}
                                              choices={this.buildChoices()}
                                              onChange={this.onItemAdd} />
                </div>
            </section>
        )
    }

});


module.exports = RemoveableDropDownListWidget;
