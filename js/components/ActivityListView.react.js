var _ = require('lodash');
var React = require('react/addons');
var Router = require('react-router');
var keyMirror = require('react/lib/keyMirror');
var cx            = React.addons.classSet;
var IconSvg = require('./common/IconSvg.react');
var Crumb = require('./common/BreadCrumb.react').Crumb;
var DropDownBehaviour = require('../forms/behaviours/DropDownBehaviour');

var AppContextMixin = require('../mixins/AppContextMixin');
var AddActivityForm = require('../forms/AddActivityForm.react');
var ActivityActionCreators = require('../actions/ActivityActionCreators');
var SalesCycleActions = require('../actions/SalesCycleActions');
var ActivityStore = require('../stores/ActivityStore');
var UserStore = require('../stores/UserStore');
var ContactStore = require('../stores/ContactStore');
var SalesCycleStore = require('../stores/SalesCycleStore');
var Modal = require('./common/Modal.react');
var SalesCycleCloser = require('./SalesCycleCloser.react');
var SalesCycleCreateForm = require('../forms/SalesCycleCreateForm.react');

// probably not required
var ProductStore = require('../stores/ProductStore');

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
                   {choice[1] + " - "} {choice[2]}
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
                        <li>
                            <div className="inputLine inputLine--newCycle">
                                <SalesCycleCreateForm onCycleCreated={this.props.onCycleCreated} />
                                <div className="inputLine-caption">
                                  Type a name for cycle and press enter.
                                </div>
                            </div>
                        </li>
                        {this.props.choices.map(this.renderChoice)}
                    </ul>
                </div>
            </div>
        </div>
        )
    }

});

var SalesCycleByAllSummary = React.createClass({

    getCycles: function() {
        return SalesCycleStore.getAll();
    },

    getActivities: function() {
        var list_of_lists = _.map(this.getCycles(), function(cycle){
            return _.map(cycle.activities || [], ActivityStore.get)
        });
        return _.reduce(list_of_lists, function(acc, list) { return acc.concat(list); }, []);
    },

    getActivitiesCnt: function() {
        return this.getActivities().length;
    },

    getTotalDuration: function() {
        return _.reduce(this.getActivities(), function(acc, act) {
            return acc + act.duration;
        }.bind(this), 0);
    },

    getAvgDuration: function() {
        var n = this.getActivitiesCnt();
        if(n === 0) return 0;
        return this.getTotalDuration() * 1. / n;
    },

    getParticipants: function() {
        var list_of_lists = _.map(this.getCycles(), function(cycle){ return cycle.user_ids });
        user_ids = _.reduce(list_of_lists, function(acc, _user_ids){ return _.union(acc, _user_ids) }, []);
        return user_ids.join(', ');
    },

    render: function() {
        return (
        <div className="stream-closeItem">
            <table className="table-summary">
              <tr>
                <td>Суммарная длительность циклов</td>
                <td>{(this.getTotalDuration() / 3600.).toFixed(1)} часов</td>
              </tr>
              <tr>
                <td>Всего событий</td>
                <td>{this.getActivitiesCnt()}</td>
              </tr>
              <tr>
                <td>Среднее время ожидания</td>
                <td>{(this.getAvgDuration() / 60.).toFixed(0)} минут</td>
              </tr>
              <tr>
                <td>Участники</td>
                <td>{this.getParticipants()}</td>
              </tr>
            </table>
            <div className="space-vertical--compact"></div>
          </div>
        )
    },
});

var SalesCycleSummary = React.createClass({

    propTypes: {
        cycle_id: React.PropTypes.string.isRequired,
    },

    getCycle: function() {
        return SalesCycleStore.get(this.props.cycle_id);
    },

    getActivities: function() {
        return _.map(this.getCycle().activities || [], function(act_id) {
            return ActivityStore.get(act_id)
        });
    },

    getActivitiesCnt: function() {
        return this.getActivities().length;
    },

    getCycleDuration: function() {
        return _.reduce(this.getActivities(), function(acc, act) {
            return acc + act.duration;
        }.bind(this), 0);
    },

    getAvgDuration: function() {
        var n = this.getActivitiesCnt();
        if(n === 0) return 0;
        return this.getCycleDuration() * 1. / n;
    },

    getParticipants: function() {
        var user_ids = this.getCycle().user_ids;
        return user_ids.join(', ')
    },

    getProducts: function() {
        var product_ids = this.getCycle().products;
        return product_ids.join(', ')
    },

    render: function() {
        console.log(this.getCycleDuration(), 'hi');
        return (
        <div className="stream-closeItem">
            <table className="table-summary">
              <tr>
                <td>Длительность цикла</td>
                <td>{(this.getCycleDuration() / 3600.).toFixed(1)} часов</td>
              </tr>
              <tr>
                <td>Всего событий</td>
                <td>{this.getActivitiesCnt()}</td>
              </tr>
              <tr>
                <td>Среднее время ожидания</td>
                <td>{(this.getAvgDuration() / 60.).toFixed(0)} минут</td>
              </tr>
              <tr>
                <td>Участники</td>
                <td>{this.getParticipants()}</td>
              </tr>
              <tr>
                <td>Продукты</td>
                <td>{this.getProducts()}</td>
              </tr>
            </table>
            <div className="space-vertical--compact"></div>
        </div>
        )
    },

});

var ActivityListView = React.createClass({
    mixins : [AppContextMixin, Router.State, Router.Navigation],

    getInitialState: function() {
        return {
            action: ACTIONS.NO_ACTION,
            sc_cnt: this.getCyclesForCurrentContact().length  // DONE: number of sales cycles for current contact
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

    getAuthor: function(user_id) {
        return UserStore.get(user_id);
    },

    getContacts: function(contact_ids) {
        return _.map(contact_ids, ContactStore.get)
    },

    renderActivity: function(act, idx) {
        var author = this.getAuthor(act.author_id),
            contacts = this.getContacts(act.contact_ids);
        return (
            <div key={'activity__' + idx} className="stream-item">
            <div className="row">
              <div className="row-icon">
                [i]
              </div>
              <div className="row-body row-body--no-trailer">
                <div className="row">
                  <a href="#" className="row-icon">
                    <figure className="icon-userpic">
                          <img src={"img/userpics/" + author.userpic} />
                    </figure>
                  </a>
                  <div className="row-body">
                    <div className="row">
                      <div className="row-body-primary text-caption text-secondary">
                        <a href="#" className="text-secondary">{author.first_name}</a> в {act.at}
                      </div>
                      <div className="row-body-secondary">
                        <a href="#" className="link-inline">
                          [c]
                        </a>
                      </div>
                    </div>
                    <div className="row-body-message">
                      {act.description}
                    </div>
                    <ul className="stream-breadcrumbs">
                        {contacts.map(function(c) {
                            return (
                                <li>
                                    <a href="#" className="stream-breadcrumbs">{c.fn}</a>
                                </li>
                            )
                        }.bind(this))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    },

    getCyclesForCurrentContact: function() {
        var contact_id = this.getParams().id;
        return SalesCycleStore.byContact(contact_id);
    },

    buildChoices: function(){
        var cycles = this.getCyclesForCurrentContact();
        cycles.push({
            'id': 'sales_0',
            'title': 'Все события',
            'status': false
        });
        return _.map(cycles, function(c){
            return [c.id, c.title, c.status];
        });
    },

    onAddAction: function(evt) {
        evt.preventDefault();
        this.setState(React.addons.update(
            this.state, {action: {$set: ACTIONS.ADD_EVENT}}));
    },

    onAddEvent: function(newEvent) {
        ActivityActionCreators.createActivity(newEvent);
    },

    onCycleSelected: function(idx, cycle_choice) {
        var cycle_id = cycle_choice[0];
        this.navigateToSalesCycle(cycle_id);
    },

    onCycleCreated: function(salesCycleObject) {
        salesCycleObject.contact_id = this.getParams().id;
        salesCycleObject.author_id = this.context.user.id;
        SalesCycleActions.create(salesCycleObject);
    },

    onCycleClosed: function(salesCycleObject) {
        var close_activity = {
            author_id: this.context.user.id,
            description: "Цикл закрыт. Сумма: " + salesCycleObject.real_value,
            feedback: 'outcome',
            participant_ids: [this.context.user.id],
            salescycle_id: salesCycleObject.id,
            duration: null
        }
        ActivityActionCreators.createActivity(close_activity);
        SalesCycleActions.close(salesCycleObject);
    },

    navigateToSalesCycle: function(cycle_id) {
        var params = this.getParams();
        params.salescycle_id = cycle_id === 'sales_0' ? null : cycle_id;
        this.refs.sales_cycle_closer.setState({
          'isShown': false,
          'salesCycleCloseValue': 0,
          'salesCycleID': params.salescycle_id
        })
        this.transitionTo('activities_by', params);
        return false;
      },

    resetState: function() {
        this.setState(this.getInitialState(), function(prev_state) {
            // new cycles created
            if(prev_state.sc_cnt < this.state.sc_cnt) {
                var sc = SalesCycleStore.getLatestOne();

                // // fake method, just to check add_product() method
                // // TODO: replace this method to appropriate place according to interface
                // sc.product_id = ProductStore.fakeGet().id
                // SalesCycleActions.add_product(sc);
                
                this.navigateToSalesCycle(sc.id);
            }
        }.bind(this, this.state));
    },

    render: function() {
        var cycle_id = ('salescycle_id' in this.getParams()) && this.getParams()['salescycle_id'] || 'sales_0';
        if(cycle_id === 'sales_0') {
            var activities = ActivityStore.getByDate();
        } else{
            var activities = ActivityStore.bySalesCycle(cycle_id);
        }

        return (
            <div className="page">
                <div className="page-header">
                    <Crumb />
                    <SalesCycleDropDownList onChange={this.onCycleSelected}
                                            onCycleCreated={this.onCycleCreated}
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

                <div className="page-body">
                    {cycle_id === 'sales_0' && (<SalesCycleByAllSummary />) || (<SalesCycleSummary cycle_id={cycle_id} />)}
                    <SalesCycleCloser ref="sales_cycle_closer" salesCycleID={cycle_id} onCycleClosed={this.onCycleClosed} />
                    {activities.map(this.renderActivity)}
                </div>

                <Modal isOpen={this.getAddEventModalState()}
                       onRequestClose={this.resetState}
                       modalTitle='ДОБАВЛЕНИЕ СОБЫТИЯ'>
                    <AddActivityForm
                        salescycle={this.getParams().salescycle_id || null}
                        current_user={this.context.user}
                        onHandleSubmit={this.onAddEvent}
                        onCancel={this.resetState} />
                </Modal>
            </div>
        );
    }

});

module.exports = ActivityListView;
