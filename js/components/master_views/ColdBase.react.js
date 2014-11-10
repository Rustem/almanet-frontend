/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var React = require('react');
var Link = require('react-router').Link;

var ContactViews = require('../../constants/CRMConstants').ContactViews;
var IconSvg = require('../common/IconSvg.react');

var current_view = ContactViews.COLD_BASE_CONTACT_VIEW;


var ColdBaseLink = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
    },
    render: function() {
        return (
            <Link to={ContactViews.get(current_view)}>
                <div className="row-icon">
                    <IconSvg iconKey="inbox" />
                </div>
                <div className="row-body">
                    <div className="row-body-primary">
                        {this.props.label}
                    </div>
                </div>
            </Link>
        )
    }
});

var ColdBaseDetailView = React.createClass({
    propTypes: {
        label: React.PropTypes.string
    },

    render: function() {
        return (
        <div className="page">
            <div className="page-header">

            </div>
            <div className="page-body">

            </div>
        </div>
        )
    }
});

module.exports.DetailView = ColdBaseDetailView;
module.exports.Link = ColdBaseLink;
