/**
 * @jsx React.DOM
 */
var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var IconSvg = require('./common/IconSvg.react');
var ContactComposer = require('./contacts/ContactComposer.react');
var AppContextMixin = require('../mixins/AppContextMixin');
var ContactActionCreators = require('../actions/ContactActionCreators');
var ActivityActionCreators = require('../actions/ActivityActionCreators');
var ContactStore = require('../stores/ContactStore');
var ActivityStore = require('../stores/ActivityStore');

var CounterableEntity = {
  propTypes: {
    amount: React.PropTypes.number,
    badgeClassName: React.PropTypes.string
  },

  renderCounter: function() {
    if(this.props.amount) {
      return (
        <sup className={this.props.badgeClassName}>{this.props.amount}</sup>
      )
    } else {
      return null;
    }
  }
};

var MenuLink = React.createClass({
  mixins : [CounterableEntity],

  propTypes: {
    label: React.PropTypes.string.isRequired,
    routeName: React.PropTypes.string.isRequired,
  },

  render: function() {
    return (
      <Link {...this.props} className="nav-link" to={this.props.routeName}>{this.props.label} {this.renderCounter()}</Link>
    )
  }

});


var Header = React.createClass({
    mixins : [AppContextMixin],

    getInitialState: function() {
      return {
        'new_contacts': ContactStore.getNew(),
        'new_activities': ActivityStore.getNew()
      }
    },

    componentDidMount: function() {
      ContactStore.addChangeListener(this._onChange);
      ActivityStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      ContactStore.removeChangeListener(this._onChange);
      ActivityStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(this.getInitialState());
    },

    onContactMenuItemClick: function(evt) {
      // if(_.size(this.state.new_contacts) > 0) {
      //   ContactActionCreators.updateNewStatus();
      // }
      return true;
    },

    onActivityMenuItemClick: function(evt) {
      if(_.size(this.state.new_activities) > 0) {
        ActivityActionCreators.updateNewStatus();
      }
      return true;
    },

    render: function() {
        return (
            <div className="body-header nav">
                <div className="nav-a">
                  <MenuLink label="Контакты"
                            routeName='contacts'
                            amount={_.size(this.state.new_contacts)}
                            badgeClassName="badge-new" />
                  <MenuLink label="Взаимодействия"
                            routeName='activities'
                            amount={_.size(this.state.new_activities)}
                            badgeClassName="badge-new"
                            onClick={this.onActivityMenuItemClick} />
                  <MenuLink label="Продукты"
                            routeName='products' />
                </div>
                <div className="nav-b">
                  <ContactComposer />
                  <button type="button" onClick={this.onToggleNotificationBar} className="nav-link">
                    <IconSvg iconKey="notifications" />
                  </button>
                </div>
            </div>

        );
    },

    onToggleNotificationBar: function() {
      this.context.toggleNotifCenter();
    }

});

module.exports = Header;
