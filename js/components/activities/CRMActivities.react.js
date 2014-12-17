/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var master_views = require('./master_views');
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var BreadCrumb = require('../common/BreadCrumb.react');


var CRMActivities = React.createClass({
    render: function() {
        return (
          <div>
            <Header />
            <div>
                <div className="body-master">
                    <div className="page page--compact">
                        <div className="page-header">
                        </div>
                        <div className="page-body">
                            <master_views.MyFeed.Link label="Моя лента" />
                            <master_views.Mentions.Link label="Упоминания" />
                            <master_views.CompanyFeed.Link label="Лента компании" />
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

module.exports = CRMActivities;
