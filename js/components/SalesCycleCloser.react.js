/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
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
        <button className="btn btn--save" type="button" onClick={this.props.onClick}>Add value</button>
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
          isShown: false,
          salesCycleCloseValue: 0,
          salesCycleID: null
        }
    },    

    render: function() {
        var stateClass = this.state['isShown'] && 'open' || undefined;
        var classNames = ['text-center'];
        classNames.push(stateClass);
        classNames = _.compact(classNames)
        var component;
        if (this.isShown()) {
          component = <SalesCycleCloseForm
                  handleSubmit={this.handleSubmit}
                  onKeyDown={this.onKeyDown}
                  isShown={this.isShown()}
                  salesCycleID={this.getSalesCycleID()}
                  salesCycleCloseValue={this.getSalesCycleCloseValue()} />;
        } else {
          component = <SalesCycleCloserButton
                  ref="menuToggler"
                  onClick={this.onFormToggle}
                  isShown={!this.isShown()} />;
        }
        return (
          <div ref="salesCycleCloser" className={classNames.join(' ')}>
            {component}    
          </div>
        );
    },
    handleSubmit: function(salesCycleObject) {
      salesCycleObject.author_id = this.context.user.id;
      SalesCycleActions.close(salesCycleObject);
      return;
    },
    onFormToggle: function(evt) {
        this.setState({
          isShown: !this.isShown(),
          salesCycleID: this.getSalesCycleID(),
          salesCycleCloseValue: this.getSalesCycleCloseValue()
        });
    },
    onKeyDown: function(evt) {
      if(evt.keyCode == ESCAPE_KEY_CODE) {
        evt.preventDefault();
        this.setState({isShown: false});
      }
    },

    isShown: function() {
      return this.state.isShown;
    },

    getSalesCycleID: function() {
      return this.state.salesCycleID;
    },

    getSalesCycleCloseValue: function() {
      return this.state.salesCycleCloseValue;
    }
});

module.exports = SalesCycleCloser;
