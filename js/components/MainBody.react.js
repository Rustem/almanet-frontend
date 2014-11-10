/**
 * @author xepa4ep
 * @jsx React.DOM
 */
var React = require('react');
var master_views = require('./master_views');
var MainBody = React.createClass({

    render: function() {
        return (
            <div>
                <div className="body-master">
                    <div className="page page--compact">
                        <div className="page-header">
                            <ul className="page-breadcrumbs">
                                <li><a href="#" className="page-breadcrumbs-link active">контакты</a></li>
                            </ul>
                        </div>
                        <div className="page-body">
                            <master_views.Shared.Link label="Входящие" />
                            <master_views.ColdBase.Link label="Холодная база" />
                        </div>
                    </div>
                </div>
                <div className="body-detail">
                    {this.props.activeRouteHandler()}
                </div>
            </div>
        )
    }

});

module.exports = MainBody;
