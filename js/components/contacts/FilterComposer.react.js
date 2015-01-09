/**
 * @jsx React.DOM
 */
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');
var Form = require('../../forms/Form.react');
var FilterStore = require('../../stores/FilterStore');
var AppContextMixin = require('../../mixins/AppContextMixin');
var inputs = require('../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Input = inputs.Input;
var Div = require('../../forms/Fieldset.react').Div;

var CommonFilterBar = React.createClass({
    propTypes: {
        value: React.PropTypes.object,
        onHandleUserInput: React.PropTypes.func,
        onEditClick: React.PropTypes.func,
    },

    render: function() {
        return (
            <Form onUpdate={this.onHandleUpdate} value={this.props.value} name='contact:filter_contacts_form' ref='filter_contacts_form'>
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

                <Div className="page-header-controls row">
                    <Div className="row-body-primary">
                        <SVGCheckbox name="select_all" className="text-secondary" label="Выбрать все" />
                    </Div>
                    {this.props.onEditClick ?
                        <Div className="row-body-secondary">
                            <a onClick={this.props.onEditClick} href="" className="text-secondary">Редактировать</a>
                        </Div>
                    : <div></div> }
                </Div>
            </Form>
        )
    },
    onHandleUpdate: function(value) {
        var form = this.refs.filter_contacts_form;
        var errors = form.validate();
        if(!errors) {
            this.props.onHandleUserInput(form.value());
        } else {
            alert(errors);
        }
    }
});

var FilterList = React.createClass({
    mixins: [AppContextMixin, Router.State],

    getInitialState: function() {
        var user_id = this.getUser().id;
        return {
            filters: FilterStore.getByUser(user_id),
            isEdit: false,
        }
    },

    getRouteName: function() {
        var routes = this.getRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name;
    },

    componentWillReceiveProps: function(nextProps) {
        if(this.getRouteName() != 'edit_filter') {
            this.setState(this.getInitialState());
        }   
    },

    componentDidMount: function() {
        FilterStore.addChangeListener(this._onChange);
    },

    componentWillUnMount: function() {
        FilterStore.removeChangeListener(this._onChange);
    },

    getFilters: function() {
        return this.state.filters;
    },

    renderFilter: function(f) {
        return <Link to="filtered" params={{id: f.id}} className="row row--oneliner row--link">
                <div className="row-icon">
                    {this.state.isEdit ? <IconSvg iconKey="remove" /> : null }
                </div>
                <div className="row-body">
                  <div className="row-body-primary">
                    {f.title}
                  </div>
                  <div className="row-body-secondary">
                    xx
                  </div>
                </div>
              </Link>
    },

    renderEditButton: function() {
        var Component = null;
        if(!_.isEmpty(this.getFilters()))
            Component = <button className="text-secondary" onClick={this.toggleEdit}>
                {this.state.isEdit ? "Отменить" : "Редактировать"}
                </button>
        return (Component)
    },

    toggleEdit: function(action) {
        var newState = React.addons.update(this.state, {
            isEdit: {$set: !this.state.isEdit},
        });
        this.setState(newState);
    },

    render: function() {
        var filters = this.getFilters();
        return (
            <div>
                <div className="row row--oneliner">
                    <div className="row-body">
                        <Link to='new_filter' className="row-body-primary">
                            <div className="row-icon">
                                <IconSvg iconKey="add" />
                            </div>
                            <div className="row-body">
                              <strong>Новый фильтр</strong>
                            </div>
                        </Link>
                        <div className="row-body-secondary">
                            {this.renderEditButton()}
                        </div>
                    </div>
                </div>
                {filters.map(this.renderFilter)}
            </div>
        );
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    },
});


module.exports = {
    FilterList: FilterList,
    CommonFilterBar: CommonFilterBar,
};