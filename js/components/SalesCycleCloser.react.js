/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var cx            = React.addons.classSet;
var IconSvg = require('./common/IconSvg.react');
var SalesCycleCloseForm = require('../forms/SalesCycleCloseForm.react');

var SalesCycleActions = require('../actions/SalesCycleActions');
var AppContextMixin = require('../mixins/AppContextMixin');

var ESCAPE_KEY_CODE = 27;

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

    getInitialState: function() {
        return {
          salesCycleCloseValue: 0,
          salesCycleID: null
        }
    },

    render: function() {
        var classNames = cx({
          'text-center': true,
          'open': this.isClosing,
        }), StateComponent = null;

        if (this.isClosing) {
          StateComponent = <SalesCycleCloseForm
                  handleSubmit={this.handleSubmit}
                  onKeyDown={this.onFormKeyDown}
                  salesCycleID={this.getSalesCycleID()}
                  salesCycleCloseValue={this.getSalesCycleCloseValue()} />;
        } else {
          StateComponent = <SalesCycleCloserButton onClick={this.onFormToggle} />;
        }
        return (
          <div ref="salesCycleCloser" className={classNames}>
            {StateComponent}
          </div>
        );
    },

    handleSubmit: function(salesCycleObject) {
      salesCycleObject.author_id = this.context.user.id;
      SalesCycleActions.close(salesCycleObject);
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
    },

    getSalesCycleID: function() {
      return this.state.salesCycleID;
    },

    getSalesCycleCloseValue: function() {
      return this.state.salesCycleCloseValue;
    }
});

module.exports = SalesCycleCloser;
