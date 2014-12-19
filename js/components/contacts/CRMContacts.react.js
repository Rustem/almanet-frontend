/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var master_views = require('./master_views');
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var UserActionCreators = require('../../actions/UserActionCreators');
var BreadCrumb = require('../common/BreadCrumb.react');



var CRMContacts = React.createClass({

    render: function() {
        return (
          <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page page--compact">
                        <div className="page-header">
                            <BreadCrumb slice={[1, -1]} />
                        </div>
                        <div className="page-body">
                            <master_views.Shared.Link label="Входящие" />
                            <master_views.AllBase.Link label="Все" />
                            <master_views.Recent.Link label="Недавние" />
                            <master_views.ColdBase.Link label="Холодная база" />
                            <master_views.LeadBase.Link label="Контакты в обработке" />
                        </div>
                    </div>
                </div>
                <div className="body-detail">
                    <RouteHandler />
                </div>
            </div>
            <Footer />
          </div>
        );
    }

});

module.exports = CRMContacts;
