var _ = require('lodash');
var React = require('react/addons');
var Router = require('react-router');
var keyMirror = require('react/lib/keyMirror');
var cx            = React.addons.classSet;
var IconSvg = require('../common/IconSvg.react');
var Crumb = require('../common/BreadCrumb.react').Crumb;
var DropDownBehaviour = require('../../forms/behaviours/DropDownBehaviour');

var AppContextMixin = require('../../mixins/AppContextMixin');
// var AddActivityForm = require('../forms/AddActivityForm.react');
var ActivityActionCreators = require('../../actions/ActivityActionCreators');
var SalesCycleActionCreators = require('../../actions/SalesCycleActionCreators');
var ActivityStore = require('../../stores/ActivityStore');
var UserStore = require('../../stores/UserStore');
var ContactStore = require('../../stores/ContactStore');
var SalesCycleStore = require('../../stores/SalesCycleStore');
var ProductStore = require('../../stores/ProductStore');
// var Modal = require('./common/Modal.react');
var SalesCycleCreateForm = require('../../forms/SalesCycleCreateForm.react');
var SalesCycleCloseForm = require('../../forms/SalesCycleCloseForm.react');
var AddActivityMiniForm = require('../../forms/AddActivityMiniForm.react');
var AddProductMiniForm = require('../../forms/AddProductMiniForm.react');
var utils = require('../../utils');

var URL_PREFIX = require('../../constants/CRMConstants').URL_PREFIX;

var ACTIONS = keyMirror({
    ADD_ACTIVITY: null,
    ADD_PRODUCT: null,
    CLOSE_SC: null,
});


var SalesCycleControlBar = React.createClass({
    propTypes: {
        action_type: React.PropTypes.string.isRequired,
        current_cycle_id: React.PropTypes.number.isRequired,
    },
    componentWillMount: function() {
        this.STATUSES = utils.get_constants('sales_cycle').statuses_hash;
    },

    get_current_action: function() {
        return this.props.action_type;
    },

    is_active_action: function(action_type) {
        return this.get_current_action() == action_type;
    },

    getSalesCycle: function() {
        return SalesCycleStore.get(this.props.current_cycle_id);
    },

    getCycleStatus: function() {
        return this.getSalesCycle().status;
    },

    shouldRenderControlBar: function() {
        var GLOBAL_SALES_CYCLE_ID = utils.get_constants('global_sales_cycle_id');
        if(_.contains([null, undefined, GLOBAL_SALES_CYCLE_ID], this.props.current_cycle_id))
          return false;
        return !(this.getCycleStatus() == this.STATUSES.COMPLETED);
    },

    getClassNames: function(action) {
        return cx({
            'stream-toolbar-btn': true,
            'active': this.is_active_action(action),
        });
    },

    render: function(){
        var Component = null;
        if(this.shouldRenderControlBar())
            Component = (<div className="stream-toolbar">
                    <button onClick={this.props.onActionActivity} className={this.getClassNames(ACTIONS.ADD_ACTIVITY)} type="button">
                        <span className="text-colorize">
                            <IconSvg iconKey="add" />
                        </span>
                        Записать взаимодействие
                    </button>
                    <button onClick={this.props.onActionProduct} className={this.getClassNames(ACTIONS.ADD_PRODUCT)} type="button">
                        <span className="text-colorize">
                            <IconSvg iconKey="add" />
                        </span>
                        Добавить продукт
                    </button>
                    <button onClick={this.props.onActionCycle} className={this.getClassNames(ACTIONS.CLOSE_SC)} type="button">
                        <span className="text-colorize">
                            <IconSvg iconKey="archive" />
                        </span>
                        Завершить цикл
                    </button>
                </div>);
        return Component;
    }

});

var AddActivityWidget = React.createClass({
    propTypes: {
        action_type: React.PropTypes.string.isRequired,
        current_cycle_id: React.PropTypes.number.isRequired,
    },
    componentWillMount: function() {
        this.SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash;
    },

    get_current_action: function() {
        return this.props.action_type;
    },

    getSalesCycle: function() {
        return SalesCycleStore.get(this.props.current_cycle_id);
    },

    getCycleStatus: function() {
        return this.getSalesCycle().status;
    },

    shouldRenderComponent: function() {
        // TODO: make something with 'sales_0'
        if(_.contains([null, undefined], this.props.current_cycle_id))
          return false;
        return !(this.getCycleStatus() == this.SALES_CYCLE_STATUS.COMPLETED) &&
               this.get_current_action() == ACTIONS.ADD_ACTIVITY;
    },

    render: function(){
        var Component = null;
        if(this.shouldRenderComponent())
            Component = <AddActivityMiniForm current_user={this.props.current_user}
                                             sales_cycle_id={this.props.current_cycle_id}
                                             onHandleSubmit={this.props.onHandleSubmit} />
        return Component
    },
});

var AddProductWidget = React.createClass({
    propTypes: {
        action_type: React.PropTypes.string.isRequired,
        current_cycle_id: React.PropTypes.number.isRequired,
    },
    componentWillMount: function() {
        this.SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash;
    },

    get_current_action: function() {
        return this.props.action_type;
    },

    getSalesCycle: function() {
        return SalesCycleStore.get(this.props.current_cycle_id);
    },

    getCycleStatus: function() {
        return this.getSalesCycle().status;
    },

    shouldRenderComponent: function() {
        var GLOBAL_SALES_CYCLE_ID = utils.get_constants('global_sales_cycle_id');
        if(_.contains([null, undefined, GLOBAL_SALES_CYCLE_ID], this.props.current_cycle_id))
          return false;
        return !(this.getCycleStatus() == this.SALES_CYCLE_STATUS.COMPLETED) &&
               this.get_current_action() == ACTIONS.ADD_PRODUCT;
    },

    render: function(){
        var Component = null;
        if(this.shouldRenderComponent())
            Component = <AddProductMiniForm sales_cycle_id={this.props.current_cycle_id}
                                            onHandleSubmit={this.props.onHandleSubmit}
                                            product_ids={this.getSalesCycle().product_ids}/>
        return Component
    },
});

var CloseCycleWidget = React.createClass({
    propTypes: {
        action_type: React.PropTypes.string.isRequired,
        current_cycle_id: React.PropTypes.number.isRequired,
    },
    componentWillMount: function() {
        this.SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash;
    },

    get_current_action: function() {
        return this.props.action_type;
    },

    getSalesCycle: function() {
        return SalesCycleStore.get(this.props.current_cycle_id);
    },

    getCycleStatus: function() {
        return this.getSalesCycle().status;
    },

    getCycleProducts: function() {
        var product_ids = this.getSalesCycle().product_ids;
        return ProductStore.getByIds(product_ids);
    },

    shouldRenderComponent: function(products) {
        var cycle = this.getSalesCycle()
        if(_.contains([null, undefined], this.props.current_cycle_id))
            return false;
        if(cycle.is_global)
            return false;
        if(products.length <= 0)
            return false;
        return !(this.getCycleStatus() == this.SALES_CYCLE_STATUS.COMPLETED) &&
               this.get_current_action() == ACTIONS.CLOSE_SC;
    },

    render: function(){
        var GLOBAL_SALES_CYCLE_ID = utils.get_constants('global_sales_cycle_id'),
            Component = null,
            products=this.getCycleProducts();
        if(this.shouldRenderComponent(products))
            Component = (
                <div>
                    {this.props.current_cycle_id === GLOBAL_SALES_CYCLE_ID && (<SalesCycleByAllSummary />) || (<SalesCycleSummary cycle_id={this.props.current_cycle_id} />)}
                    <SalesCycleCloseForm
                    products={products}
                    salesCycleID={this.props.current_cycle_id}
                    handleSubmit={this.props.onCycleClosed}
                    onKeyDown={this.onFormKeyDown} />
                </div>
            )
        return Component
    },
});

var SalesCycleDropDownList = React.createClass({
    mixins: [DropDownBehaviour],

    propTypes: {
        current_cycle_id: React.PropTypes.number.isRequired
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
            // TODO there was '==='
            // ids on Backend is 'int', but Query get as 'string'
            return choice[0] == this.props.current_cycle_id
        }.bind(this));
    },

    render: function(){
        var className = cx({
            'dropdown': true,
            'page-header-filterContainer': true,
            'open': this.state.isOpen
        });
        var cur_choice = this.getCurrentChoice();

        return (
        <div className={className}>
            <button ref='menuToggler' type="button" className="page-header-filterContainer"
                                      onKeyDown={this.onKeyDown}
                                      onClick={this.onMenuToggle}
                                      >
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
                                  Введите название цикла и нажмите Enter.
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
        // return _.reduce(this.getActivities(), function(acc, act) {
        //     return acc + act.duration;
        // }.bind(this), 0);
        return 0;
    },

    getAvgDuration: function() {
        // var n = this.getActivitiesCnt();
        // if(n === 0) return 0;
        // return this.getTotalDuration() * 1. / n;
        return 0;
    },

    // getParticipants: function() {
    //     var list_of_lists = _.map(this.getCycles(), function(cycle){ return cycle.user_ids });
    //     user_ids = _.reduce(list_of_lists, function(acc, _user_ids){ return _.union(acc, _user_ids) }, []);
    //     return user_ids.join(', ');
    // },

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
            </table>
            <div className="space-vertical--compact"></div>
          </div>
        )
    },
});

var SalesCycleSummary = React.createClass({

    propTypes: {
        cycle_id: React.PropTypes.number.isRequired,
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
        // return _.reduce(this.getActivities(), function(acc, act) {
        //     return acc + act.duration;
        // }.bind(this), 0);
        return 0;
    },

    getAvgDuration: function() {
        // var n = this.getActivitiesCnt();
        // if(n === 0) return 0;
        // return this.getCycleDuration() * 1. / n;
        return 0;
    },

    // getParticipants: function() {
    //     var user_ids = this.getCycle().user_ids;
    //     return user_ids.join(', ')
    // },

    getProducts: function() {
        var product_ids = this.getCycle().product_ids;
        return _.map(ProductStore.getByIds(product_ids), function(p) {return p.name}).join(', ')
    },

    render: function() {
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
            action: ACTIONS.ADD_ACTIVITY,
            sc_cnt: this.getCyclesForCurrentContact().length  // DONE: number of sales cycles for current contact
        }
    },
    componentWillMount: function() {
        this.FEEDBACK_ICONS = utils.get_constants('activity').feedback_icons;
    },

    // getAddEventModalState: function() {
    //     return this.state.action === ACTIONS.ADD_ACTIVITY;
    // },

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
                <IconSvg iconKey={this.FEEDBACK_ICONS[act.feedback_status]} />
              </div>
              <div className="row-body row-body--no-trailer">
                <div className="row">
                  <a href="#" className="row-icon">
                    <figure className="icon-userpic">
                          <img src={URL_PREFIX + author.userpic} />
                    </figure>
                  </a>
                  <div className="row-body">
                    <div className="row">
                      <div className="row-body-primary text-caption text-secondary">
                        <a href="#" className="text-secondary">{author.vcard.fn}</a> в {utils.formatTime(act)}
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
                                    <a href="#" className="stream-breadcrumbs">{c.vcard.fn}</a>
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
        var contact_id = parseInt(this.getParams().id, 10);
        return SalesCycleStore.getCyclesForCurrentContact(contact_id);
    },

    buildChoices: function(){
        var cycles = this.getCyclesForCurrentContact();
        // cycles.push({
        //     'id': 'sales_0',
        //     'title': 'Все события',
        //     'status': false
        // });
        return _.map(cycles, function(c){
            return [c.id, c.title, c.status];
        });
    },

    onActionActivity: function(evt) {
        evt.preventDefault();
        this.setState(React.addons.update(
            this.state, {action: {$set: ACTIONS.ADD_ACTIVITY}}));
    },

    onActionProduct: function(evt) {
        evt.preventDefault();
        this.setState(React.addons.update(
            this.state, {action: {$set: ACTIONS.ADD_PRODUCT}}));
    },

    onActionCycle: function(evt) {
        evt.preventDefault();
        this.setState(React.addons.update(
            this.state, {action: {$set: ACTIONS.CLOSE_SC}}));
    },

    onAddActivity: function(newActivity) {
        ActivityActionCreators.createActivity(newActivity);
    },

    onAddProduct: function(object) {
        SalesCycleActionCreators.add_products(object);
    },

    onCycleSelected: function(idx, cycle_choice) {
        var cycle_id = cycle_choice[0];
        this.navigateToSalesCycle(cycle_id);
    },

    onCycleCreated: function(salesCycleObject) {
        salesCycleObject.contact_id = parseInt(this.getParams().id, 10);
        salesCycleObject.author_id = this.getUser().crm_user_id;
        SalesCycleActionCreators.create(salesCycleObject);
    },

    onCycleClosed: function(sales_cycle_closing) {
        var sales_cycle = _.extend(
            {},
            SalesCycleStore.get(sales_cycle_closing.id),
            sales_cycle_closing);
        SalesCycleActionCreators.close(sales_cycle);
    },

    navigateToSalesCycle: function(cycle_id) {
        var GLOBAL_SALES_CYCLE_ID = utils.get_constants('global_sales_cycle_id'),
            params = this.getParams();
        params.sales_cycle_id = cycle_id === GLOBAL_SALES_CYCLE_ID ? null : cycle_id;
        this.transitionTo('activities_by', params);
        return false;
    },

    resetState: function() {
        this.setState(this.getInitialState(), function(prev_state) {
            // new cycles created
            if(prev_state.sc_cnt < this.state.sc_cnt) {
                var sc = SalesCycleStore.getLatestOne();
                this.navigateToSalesCycle(sc.id);
            }
        }.bind(this, this.state));
    },

    render: function() {
        var GLOBAL_SALES_CYCLE_ID = utils.get_constants('global_sales_cycle_id'),
            cycle_id = ('sales_cycle_id' in this.getParams()) && parseInt(this.getParams()['sales_cycle_id'], 10) || GLOBAL_SALES_CYCLE_ID;
        if( !cycle_id ) { // monkey patching
            cycle_id = SalesCycleStore.getGlobal().id
        }

        if(cycle_id === GLOBAL_SALES_CYCLE_ID) {
            var activities = ActivityStore.bySalesCycles(
                _.map(this.getCyclesForCurrentContact(),function(sc){
                    return sc.id
                }));
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
                    <SalesCycleControlBar onActionActivity={this.onActionActivity}
                                          onActionProduct={this.onActionProduct}
                                          onActionCycle={this.onActionCycle}
                                          action_type={this.state.action}
                                          current_cycle_id={cycle_id} />
                </div>

                <div className="page-body">
                    <AddActivityWidget action_type={this.state.action}
                                       current_cycle_id={cycle_id}
                                       current_user={this.getUser()}
                                       onHandleSubmit={this.onAddActivity} />
                    <AddProductWidget action_type={this.state.action}
                                      current_cycle_id={cycle_id}
                                      onHandleSubmit={this.onAddProduct} />
                    <CloseCycleWidget action_type={this.state.action}
                                      current_cycle_id={cycle_id}
                                      onCycleClosed={this.onCycleClosed}
                                      current_user={this.getUser()} />
                    {activities.map(this.renderActivity)}
                </div>

            </div>
        );
    }


});

module.exports = ActivityListView;
