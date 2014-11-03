/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var IconSvg = require('./common/IconSvg.react');
var DropDownMixin = require('./mixins/DropDownMixin.react');
var ContactCreateForm = require('../forms/ContactCreateForm.react');

var ESCAPE_KEY_CODE = 27;

var ContactComposerButton = React.createClass({

  getDefaultProps: function() {
    return {
      onClick: undefined,
      onKeyDown: undefined
    };
  },

  render: function() {
    return (
      <button className="nav-btn" data-toggle="dropdown" type="button"
          onClick={this.props.onClick}
          onKeyDown={this.props.onKeyDown}>
        <div className="row-body">
          <div className="row-icon">
            <IconSvg iconKey="add" />
          </div>
          <div className="row-body">Новый контакт / импорт</div>
        </div>
      </button>
    );
  }
});


var ContactComposerForm = React.createClass({
  render: function() {
    return (
      <div className="dropdown-menu" style={{height: '310px'}}>
        <div className="addContact">
          <div className="addContact-edit">
              <ContactCreateForm />
          </div>
        </div>
      </div>
    )
  }
});


// Main Component

var ContactComposer = React.createClass({
    // mixins: [DropDownMixin],

    getInitialState: function() {
        return {
          isOpen: false
        }
    },

    render: function() {
        var stateClass = this.state['isOpen'] && 'open' || undefined;
        var classNames = ["dropdown", "dropdown--inline", "dropdown--right"];
        classNames.push(stateClass);
        classNames = _.compact(classNames)
        return (
          <div ref="contactComposer" className={classNames.join(' ')}  data-verticalfit=".body-master">
            <ContactComposerButton
              ref="menuToggler"
              onClick={this.onMenuToggle}
              onKeyDown={this.onKeyDown} />
            <ContactComposerForm
              ref="contactForm"
              isOpen={this.isOpen()} />
          </div>
        );
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.isOpen()) {
        }
    },
    onMenuToggle: function(evt) {
        this.setState({isOpen: !this.isOpen()}, function() {
            if(this.isOpen()) {
              this.refs.menuToggler.getDOMNode().focus();
            }
        });
    },
    onKeyDown: function(evt) {
      if(evt.keyCode == ESCAPE_KEY_CODE) {
        evt.preventDefault();
        this.setState({isOpen: false});
      }
    },
    isOpen: function() {
      return this.state.isOpen;
    }
});

module.exports = ContactComposer;
