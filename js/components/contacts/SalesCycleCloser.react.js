/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var cx            = React.addons.classSet;
var IconSvg = require('../common/IconSvg.react');
var CRMConstants = require('../../constants/CRMConstants');
var SalesCycleCloseForm = require('../../forms/SalesCycleCloseForm.react');
var SalesCycleStore = require('../../stores/SalesCycleStore');
var ProductStore = require('../../stores/ProductStore');
var AppContextMixin = require('../../mixins/AppContextMixin');

var ESCAPE_KEY_CODE = 27;
var SALES_CYCLE_STATUS = CRMConstants.SALES_CYCLE_STATUS;

var SalesCycleCloserButton = React.createClass({

  getDefaultProps: function() {
    return {
      onClick: undefined,
      onKeyDown: undefined
    };
  },

  render: function() {
      return (
        <button className="btn btn--save" type="button" onClick={this.props.onClick}>Закрыть цикл ?</button>
      );
  }
});

// FORM_REF = 'sales_cycle_close_form'
// var SalesCycleCloseComposerForm = React.createClass({
//   propTypes: {
//     handleSubmit: React.PropTypes.func
//   },

//   render: function() {
//     return (
//       <SalesCycleCloseForm ref={FORM_REF} onHandleSubmit={this.props.handleSubmit} onKeyDown={this.props.onKeyDown}/>
//     )
//   },

//   getForm: function(){
//     return this.refs[FORM_REF].refs[FORM_REF];
//   },
// });


// Main Component

var SalesCycleCloser = React.createClass({

    mixins: [AppContextMixin],

    componentDidMount: function() {
      SalesCycleStore.addChangeListener(this.resetState)
    },

    resetState: function() {
      this.isClosing = false;
      this.forceUpdate();
    },

    getCurrentCycle: function() {
        return SalesCycleStore.get(this.props.salesCycleID);
    },

    getCycleProducts: function() {
        var product_ids = this.getCurrentCycle().products;
        return ProductStore.getByIds(product_ids);
    },

    canRenderActionBar: function() {
        if([null, undefined, 'sales_0'].indexOf(this.props.salesCycleID) > -1)
          return false;
        return !(this.getCurrentCycle().status == SALES_CYCLE_STATUS.FINISHED);
    },

    render: function() {
        var classNames = cx({
          'text-center': true,
          'open': this.isClosing,
        }), StateComponent = null;

        if(this.canRenderActionBar()) {
          if (this.isClosing) {
            StateComponent = <SalesCycleCloseForm
                    products={this.getCycleProducts()}
                    salesCycleID={this.props.salesCycleID}
                    handleSubmit={this.handleSubmit}
                    onKeyDown={this.onFormKeyDown} />;
          } else {
            StateComponent = <SalesCycleCloserButton onClick={this.onFormToggle} />;
          }
        }
        return (
          <div ref="salesCycleCloser" className={classNames}>
            {StateComponent}
          </div>
        );
    },

    handleSubmit: function(salesCycleObject) {
      this.props.onCycleClosed(salesCycleObject);
      return;
    },

    onFormToggle: function(evt) {
        if(!'isClosing' in this) {
          this.isClosing = false;
        }
        this.isClosing = !this.isClosing;
        this.forceUpdate();
    },

    onFormKeyDown: function(evt) {
      if(evt.keyCode == ESCAPE_KEY_CODE) {
        evt.preventDefault();
        this.isClosing = false;
        this.forceUpdate();
      }
    }
});

module.exports = SalesCycleCloser;
