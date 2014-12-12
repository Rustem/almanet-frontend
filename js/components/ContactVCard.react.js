var _ = require('lodash');
var React = require('react');
var ContactEditForm = require('../forms/ContactEditForm.react');
var VIEW_MODES_MAP = require('../constants/CRMConstants').CONTACT_VIEW_MODE;
var VIEW_MODES = _.values(VIEW_MODES_MAP);
var keyMirror = require('react/lib/keyMirror');

var ContactStore = require('../stores/ContactStore');

var ContactVCard = React.createClass({
    propTypes: {
        contact: React.PropTypes.object,
        mode: React.PropTypes.oneOf(VIEW_MODES),
        onHandleSubmit: React.PropTypes.func
    },
    renderPhone: function(phone, idx) {
        return (
        <div key={'phone--' + idx} className="inputLine inputLine--vcardRow">
          <div className="row">
            <div className="row-icon">
            </div>
            <div className="row-body">
              <div className="inputLine-negativeTrail">
                <div className="text-caption text-secondary">
                  {phone.type}
                </div>
              </div>
              <div className="inputLine-div">
                {phone.value}
              </div>
            </div>
          </div>
        </div>
        )
    },
    renderEmail: function(email, idx) {
        return (
        <div key={'email--' + idx} className="inputLine inputLine--vcardRow">
          <div className="row">
            <div className="row-icon">
            </div>
            <div className="row-body">
              <div className="inputLine-negativeTrail">
                <div className="text-caption text-secondary">
                  {email.type}
                </div>
              </div>
              <div className="inputLine-div">
                {email.value}
              </div>
            </div>
          </div>
        </div>)
    },

    renderUrl: function(url, idx) {
        return (
        <div key={'email--' + idx} className="inputLine inputLine--vcardRow">
          <div className="row">
            <div className="row-icon">
            </div>
            <div className="row-body">
              <div className="inputLine-negativeTrail">
                <div className="text-caption text-secondary">
                  {url.type}
                </div>
              </div>
              <div className="inputLine-div">
                {url.value}
              </div>
            </div>
          </div>
        </div>)
    },

    renderContacts: function(contact) {
      if(contact.contacts == undefined)
          return null;
      return (
        <div className="inputLine inputLine--vcardRow">
          <div className="row">
            <div className="row-icon">
            </div>
            <div className="row-body">
              <div className="inputLine-negativeTrail">
                <div className="text-caption text-secondary">
                  Работники в этой компании
                </div>
              </div>
              {contact.contacts.map(function(c_id){
                var c = ContactStore.get(c_id);
                return <div className="inputLine-div">{c.fn}</div>
              })}
            </div>
          </div>
        </div>
      )
    },

    render_read: function() {
        var contact = this.props.contact;
        var RelatedContactsWidget = this.renderContacts(contact);
        return (
            <div className="contact">
                <div className="inputLine">
                    <div className="row">
                      <div className="row-icon"></div>
                      <div className="row-body">
                        <div className="inputLine-negativeTrail text-large text-strong">
                          {contact.fn}
                      </div>
                      <div className="inputLine-negativeTrail text-secondary">
                        {contact.companyName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-vertical space-vertical--compact"></div>

                {contact.emails.map(this.renderEmail)}
                <div className="space-verticalBorder"></div>

                {contact.phones.map(this.renderPhone)}
                <div className="space-verticalBorder"></div>

                {contact.urls.map(this.renderUrl)}
                <div className="space-verticalBorder"></div>

                <div className="inputLine inputLine--vcardRow">
                  <div className="row">
                    <div className="row-icon">
                    </div>
                    <div className="row-body">
                      <div className="inputLine-negativeTrail">
                        <div className="text-caption text-secondary">
                          Заметка
                        </div>
                      </div>
                      <div className="inputLine-div">{contact.note}</div>
                    </div>
                  </div>
                </div>
                {RelatedContactsWidget ? <div className="space-verticalBorder"></div> : null}
                {RelatedContactsWidget}


            </div>
        );
    },
    render_edit: function() {
        return  (
            <div className="contact">
                <ContactEditForm ref="contact_edit_form" value={this.props.contact}
                                 onHandleSubmit={this.props.onHandleSubmit} />
            </div>
        )
    },

    render: function() {
        var mode = this.props.mode;
        return mode === VIEW_MODES_MAP.EDIT && this.render_edit() || this.render_read();
    },

    triggerSubmit: function() {
      if(!(this.props.mode === VIEW_MODES_MAP.EDIT)) return;
      this.refs.contact_edit_form.triggerSubmit();
    }

});

module.exports = ContactVCard;
