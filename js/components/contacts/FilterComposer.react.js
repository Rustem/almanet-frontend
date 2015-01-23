/**
 * @jsx React.DOM
 */
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var fuzzySearch = require('../../utils').fuzzySearch;
var IconSvg = require('../common/IconSvg.react');
var Form = require('../../forms/Form.react');
var ContactStore = require('../../stores/ContactStore');
var FilterStore = require('../../stores/FilterStore');
var FilterActionCreators = require('../../actions/FilterActionCreators');
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
    mixins: [AppContextMixin, Router.State, Router.Navigation],

    getInitialState: function() {
        var user_id = this.getUser().crm_user_id;
        return {
            filters: FilterStore.getByUser(user_id),
            isEdit: false,
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        FilterStore.addChangeListener(this._onChange);
        ContactStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        FilterStore.removeChangeListener(this._onChange);
        ContactStore.removeChangeListener(this._onChange);
    },

    getFilters: function() {
        return this.state.filters;
    },

    getDefaultContacts: function(filter) {
        switch(filter.base) {
            case 'all':
                return ContactStore.getByDate(true);
            case 'recent':
                return ContactStore.getRecent();
            case 'cold':
                return ContactStore.getColdByDate(true);
            case 'lead':
                return ContactStore.getLeads(true);
        }
    },

    applyFilter: function(filter) {
        var contacts = this.getDefaultContacts(filter);
        if(filter.filter_text)
            contacts = fuzzySearch(contacts, filter.filter_text, {
                'keys': ['vcard.fn', 'vcard.emails.value']});
        return contacts;
    },

    renderFilter: function(f) {
        var Component = this.state.isEdit ? 
            (<div className="row row--oneliner row--link">
                <div className="row-icon">
                    <button onClick={this.deleteFilter.bind(null, f.id)} >
                        <IconSvg iconKey="remove" />
                    </button>
                </div>
                <div className="row-body">
                  <div className="row-body-primary">
                    {f.title}
                  </div>
                  <div className="row-body-secondary">
                    {this.applyFilter(f).length}
                  </div>
                </div>
            </div>) :
            (<Link to="filtered" params={{id: f.id}} className="row row--oneliner row--link">
                <div className="row-icon">
                </div>
                <div className="row-body">
                  <div className="row-body-primary">
                    {f.title}
                  </div>
                  <div className="row-body-secondary">
                    {this.applyFilter(f).length}
                  </div>
                </div>
            </Link>
            )
        return Component
              
    },

    renderEditButton: function() {
        var Component = null;
        if(!_.isEmpty(this.getFilters()))
            Component = <button className="text-secondary" onClick={this.toggleEdit}>
                {this.state.isEdit ? "Отменить" : "Редактировать"}
                </button>
        return (Component)
    },

    deleteFilter: function(id) {
        FilterActionCreators.delete(id);
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
