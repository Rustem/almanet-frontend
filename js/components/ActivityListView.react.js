var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var keyMirror = require('react/lib/keyMirror');
var cx            = React.addons.classSet;
var IconSvg = require('./common/IconSvg.react');
var Crumb = require('./common/BreadCrumb.react').Crumb;
var DropDownBehaviour = require('../forms/behaviours/DropDownBehaviour');

var AppContextMixin = require('../mixins/AppContextMixin');
var AddActivityForm = require('../forms/AddActivityForm.react');
var ActivityActionCreators = require('../actions/ActivityActionCreators');
var ActivityStore = require('../stores/ActivityStore');
var SalesCycleStore = require('../stores/SalesCycleStore');
var Modal = require('./common/Modal.react');

var ACTIONS = keyMirror({
    NO_ACTION: null,
    ADD_EVENT: null,
});

var SalesCycleDropDownList = React.createClass({
    mixins: [DropDownBehaviour],

    propTypes: {
        current_cycle_id: React.PropTypes.string.isRequired
    },

    renderChoice: function(choice, idx) {
        return (
            <li>
                <a key={'choice__' + idx} onClick={this.onChoice.bind(null, idx)} className="dropdown-menu-link">
                   {choice[1]}
                </a>
            </li>
        )
    },

    getCurrentChoice: function(){
        return _.find(this.props.choices, function(choice){
            return choice[0] === this.props.current_cycle_id
        }.bind(this));
    },

    render: function(){
        var className = cx({
            'dropdown': true,
            'dropdown--filterContainer': true,
            'open': this.state.isOpen
        });
        var cur_choice = this.getCurrentChoice();

        return (
        <div className={className}>
            <button ref='menuToggler' onKeyDown={this.onKeyDown} onClick={this.onMenuToggle} type="button"type="button" className="page-header-filterContainer">
                <div className="page-header-filter row">
                    <div className="row-body row-body--inverted">
                      <div className="row-body-secondary">
                        <IconSvg iconKey="arrow-down" />
                      </div>
                      <div className="row-body-primary row-body-primary--extraOffset">
                        <strong>{cur_choice[1]}</strong>
                        <span className="text-caption text-secondary">(выберите цикл продаж)</span>
                      </div>
                    </div>
                  </div>
            </button>
            <div className="dropdown-menu">
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

var ActivityListView = React.createClass({
    mixins : [AppContextMixin, Router.State, Router.Navigation],

    getInitialState: function() {
        return {
            action: ACTIONS.NO_ACTION,
        }
    },

    getAddEventModalState: function() {
        return this.state.action === ACTIONS.ADD_EVENT;
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this.resetState);
        SalesCycleStore.addChangeListener(this.resetState);
    },
    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this.resetState);
        SalesCycleStore.removeChangeListener(this.resetState);
    },

    onCycleSelected: function(idx, cycle_choice) {
        var cycle_id = cycle_choice[0];
        var params = this.getParams();
        params.salescycle_id = cycle_id;
        this.transitionTo('activities_by', params);
        return false;
    },

    buildChoices: function(){
        var cycles = SalesCycleStore.getAll();
        cycles.push({
            'id': 'sales_0',
            'title': 'Все события'
        });
        return _.map(cycles, function(c){
            return [c.id, c.title];
        });
    },

    onAddAction: function(evt) {
        evt.preventDefault();
        this.setState({action: ACTIONS.ADD_EVENT})
    },

    onAddEvent: function(newEvent) {
        ActivityActionCreators.createActivity(newEvent);
    },

    resetState: function() {
        this.setState({action: ACTIONS.NO_ACTION});
    },

    render: function() {
        var cycle_id = ('salescycle_id' in this.getParams()) && this.getParams()['salescycle_id'] || 'sales_0';
        return (
            <div className="page">
                <div className="page-header">
                    <Crumb />
                    <SalesCycleDropDownList onChange={this.onCycleSelected}
                                            current_cycle_id={cycle_id}
                                            choices={this.buildChoices()} />
                    <div className="page-header-controls">
                        <a onClick={this.onAddAction} href="#" className="row row--oneliner row--link">
                          <div className="row-icon text-good">
                            <IconSvg iconKey="add" />
                          </div>
                          <div className="row-body">
                            Добавить событие
                          </div>
                        </a>
                      </div>
                </div>

                <Modal isOpen={this.getAddEventModalState()}
                       onRequestClose={this.resetState}
                       modalTitle='ДОБАВЛЕНИЕ СОБЫТИЯ'>
                    <AddActivityForm
                        salescycle={this.getParams().salescycle_id}
                        current_user={this.context.user}
                        onHandleSubmit={this.onAddEvent}
                        onCancel={this.resetState} />
                </Modal>
            </div>
        );
    }

});

module.exports = ActivityListView;
