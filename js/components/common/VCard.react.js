var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var ContactEditForm = require('../../forms/ContactEditForm.react');
var UserEditForm = require('../../forms/UserEditForm.react');
var VIEW_MODES_MAP = require('../../constants/CRMConstants').CONTACT_VIEW_MODE;
var VIEW_MODES = _.values(VIEW_MODES_MAP);
var keyMirror = require('react/lib/keyMirror');
var utils = require('../../utils');

var ContactStore = require('../../stores/ContactStore');

VCardFields = {
  renderTels: function(tels) {
    var renderer = function(tel, idx) {
      return (
        <div key={'tel--' + idx} className="inputLine inputLine--vcardRow">
          <div className="row">
            <div className="row-icon">
            </div>
            <div className="row-body">
              <div className="inputLine-negativeTrail">
                <div className="text-caption text-secondary">
                  {tel.type}
                </div>
              </div>
              <div className="inputLine-div">
                {tel.value}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        {tels.map(renderer)}
        {tels.length > 0 ? <div className="space-verticalBorder"></div> : null}
      </div>
    )
  },
  renderEmails: function(emails) {
    var renderer = function(email, idx) {
      return (<div key={'email--' + idx} className="inputLine inputLine--vcardRow">
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
    }
                    
    return (
      <div>
        {emails.map(renderer)}
        {emails.length > 0 ? <div className="space-verticalBorder"></div> : null}
      </div>
    )
  },

  renderUrls: function(urls) {
    var renderer = function(url, idx) {
      return (
        <div key={'url--' + idx} className="inputLine inputLine--vcardRow">
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
      }

      return (
      <div>
        {urls.map(renderer)}
        {urls.length > 0 ? <div className="space-verticalBorder"></div> : null}
      </div>
    )
  },

  renderAdrs: function(adrs) {
    var renderer = function(adr, idx) {
      return (
        <div key={'adr--' + idx} className="inputLine inputLine--vcardRow">
          <div className="row">
            <div className="row-icon">
            </div>
            <div className="row-body">
              <div className="inputLine-negativeTrail">
                <div className="text-caption text-secondary">
                  {adr.type}
                </div>
              </div>
              <div className="inputLine-div">
                {_.compact([adr.postal_code, adr.country_name, adr.locality, adr.region, adr.street_address]).join(', ')}
              </div>
            </div>
          </div>
        </div>)
      }

      return (
      <div>
        {adrs.map(renderer)}
        {adrs.length > 0 ? <div className="space-verticalBorder"></div> : null}
      </div>
    )
  },

  renderContacts: function(contact) {
    if(contact.children == undefined || contact.children.length == 0)
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
            {contact.children.map(function(c_id){
              var c = ContactStore.get(c_id);
              return <div className="inputLine-div">
                      <Link to='contact_profile' params={{id: c.id}}>{c.vcard.fn}</Link>
                     </div>
            })}
          </div>
        </div>
      </div>
    )
  },

  renderOrg: function(org) {
    return (
      org.organization_name
    )
  },

  renderTitle: function(title) {
    return (
      title.data
    )
  },

  renderCompany: function(c_id) {
    company = ContactStore.inCompany(c_id);
    if(company == null)
      return null;
    return (
      <div className="inputLine inputLine--vcardRow">
        <div className="row">
          <div className="row-icon">
          </div>
          <div className="row-body">
            <div className="inputLine-negativeTrail">
              <div className="text-caption text-secondary">
                Компания
              </div>
            </div>
              <div className="inputLine-div">
                <Link to='contact_profile' params={{id: company.id}}>{company.vcard.fn}</Link>
              </div>
          </div>
        </div>
      </div>
    )
  },

  renderNote: function(share) {
    if(share == undefined)
      return null;
    return (
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
            <div className="inputLine-div">{share.note}</div>
          </div>
        </div>
      </div>
    )
  },

  render: function() {
      var mode = this.props.mode;
      return mode === VIEW_MODES_MAP.EDIT && this.render_edit() || this.render_read();
  },

}

var ContactVCard = React.createClass({
    mixins: [VCardFields],

    propTypes: {
        contact: React.PropTypes.object,
        mode: React.PropTypes.oneOf(VIEW_MODES),
        onHandleSubmit: React.PropTypes.func
    },    

    render_read: function() {
        var CONTACT_TYPES = utils.get_constants('contact').tp_hash;
        var contact = this.props.contact;
        var RelatedContactsWidget = this.renderContacts(contact);
        var RelatedCompanyWidget = this.renderCompany(contact.id);
        return (
            <div className="contact">
                <div className="inputLine">
                    <div className="row">
                      <div className="row-icon"></div>
                      <div className="row-body">
                        <div className="inputLine-negativeTrail text-large text-strong">
                          {contact.vcard.fn}
                      </div>
                      {contact.tp == CONTACT_TYPES.USER ? 
                      [<div className="inputLine-negativeTrail text-secondary">
                        {contact.vcard.orgs.map(this.renderOrg)}
                      </div>,
                      <div className="inputLine-negativeTrail text-secondary">
                        {contact.vcard.titles.map(this.renderTitle)}
                      </div>]
                       : undefined}
                    </div>
                  </div>
                </div>
                <div className="space-vertical space-vertical--compact"></div>

                {this.renderEmails(contact.vcard.emails)}

                {this.renderTels(contact.vcard.tels)}

                {this.renderUrls(contact.vcard.urls)}

                {this.renderAdrs(contact.vcard.adrs)}

                {this.renderNote(contact.share)}

                {RelatedContactsWidget ? <div className="space-verticalBorder"></div> : null}
                {RelatedContactsWidget}

                {RelatedCompanyWidget ? <div className="space-verticalBorder"></div> : null}
                {RelatedCompanyWidget}

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

    triggerSubmit: function() {
      if(!(this.props.mode === VIEW_MODES_MAP.EDIT)) return;
      this.refs.contact_edit_form.triggerSubmit();
    }
});

var UserVCard = React.createClass({
    mixins: [VCardFields],

    propTypes: {
        user: React.PropTypes.object,
        mode: React.PropTypes.oneOf(VIEW_MODES),
        onHandleSubmit: React.PropTypes.func
    },
    

    render_read: function() {
        var user = this.props.user;
        return (
            <div className="contact">
              <div className="inputLine">
                <div className="row">
                  <div className="row-icon"></div>
                  <div className="row-body">
                    <div className="text-large text-strong">
                      {user.vcard.fn}
                    </div>
                    <div className="inputLine-negativeTrail text-secondary">
                      {user.vcard.titles.map(this.renderTitle)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-vertical space-vertical--compact"></div>

              {this.renderEmails(user.vcard.emails)}

              {this.renderTels(user.vcard.tels)}

              {this.renderUrls(user.vcard.urls)}


            </div>
        );
    },
    render_edit: function() {
        return  (
            <div className="contact">
                <UserEditForm ref="user_edit_form" value={this.props.user}
                                 onHandleSubmit={this.props.onHandleSubmit} />
            </div>
        )
    },

    triggerSubmit: function() {
      if(!(this.props.mode === VIEW_MODES_MAP.EDIT)) return;
      this.refs.user_edit_form.triggerSubmit();
    }

});

module.exports = {
  ContactVCard: ContactVCard,
  UserVCard: UserVCard
};
