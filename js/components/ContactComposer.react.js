/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var IconSvg = require('./common/IconSvg.react');
var DropDownMixin = require('./mixins/DropDownMixin.react');
var ContactCreateForm = require('../forms/ContactCreateForm.react');

var ContactActionCreators = require('../actions/ContactActionCreators');

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

FORM_REF = 'contact_form'

var ContactComposerForm = React.createClass({


  render: function() {
    return (
      <div className="dropdown-menu" style={{height: '310px'}}>
        <div className="addContact">
          <div className="addContact-edit">
              <ContactCreateForm ref={FORM_REF} onSubmit={this.handleSubmit} />
          </div>
        </div>
      </div>
    )
  },

  getForm: function(){
    return this.refs[FORM_REF].refs[FORM_REF];
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var form = this.getForm();
    errors = form.validate();
    if(!errors) {
        var contactObject = form.value();
        ContactActionCreators.createContact(contactObject);
    } else{
        alert(errors);
    }

    return;
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
          <div ref="contactComposer" className={classNames.join(' ')}  data-verticalfit="body-master">
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
              this.setDropDownHeight();
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

    setDropDownHeight: function() {
        var className = this.getDOMNode().getAttribute('data-verticalfit');
        var height = document.getElementsByClassName(className)[0].clientHeight;
        this.refs.contactForm.getDOMNode().style.height = height + 'px';
    },

    isOpen: function() {
      return this.state.isOpen;
    }
});

module.exports = ContactComposer;
