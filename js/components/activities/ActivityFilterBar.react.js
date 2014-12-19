/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var IconSvg = require('../common/IconSvg.react');
var Form = require('../../forms/Form.react');
var inputs = require('../../forms/input');
var Input = inputs.Input;
var Div = require('../../forms/Fieldset.react').Div;

var FilterBar = React.createClass({
    propTypes: {
        value: React.PropTypes.object,
        onHandleUserInput: React.PropTypes.func
    },
    render: function() {
        return (
            <Form onUpdate={this.onHandleUpdate} value={this.props.value} name='activity:filter_activity_form' ref='filter_activity_form'>
                <Div className="page-header-filterContainer">
                    <Div className="page-header-filter row">
                        <Div className="row-icon">
                            <IconSvg iconKey='search' />
                        </Div>
                        <Div className="row-body row-body--inverted">
                            <Div className="row-body-secondary">
                                <IconSvg iconKey='arrow-down' />
                            </Div>
                            <Div className="row-body-primary">
                                <Input name="filter_text" type="text" className="input-filter" placeholder="Фильтр" />
                            </Div>
                        </Div>
                    </Div>
                </Div>

            </Form>
        )
    },
    onHandleUpdate: function(value) {
        var form = this.refs.filter_activity_form;
        var errors = form.validate();
        if(!errors) {
            this.props.onHandleUserInput(form.value());
        } else {
            alert(errors);
        }
    }

});

module.exports = FilterBar;