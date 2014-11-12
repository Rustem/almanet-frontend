/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var cx        = React.addons.classSet;
var Router = require('react-router');
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');

var ContactStore = require('../../stores/ContactStore');


function get_coldbase_contacts() {
    return _.size(ContactStore.getAll());
}


var ColdBaseLink = React.createClass({
    mixins: [Router.ActiveState],
    propTypes: {
        label: React.PropTypes.string,
        amount: React.PropTypes.number
    },

    getInitialState: function() {
        return {'amount': get_coldbase_contacts()};
    },

    componentDidMount: function() {
        ContactStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ContactStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({'amount': get_coldbase_contacts()});
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive()
        });
        return (
            <Link className={className} to='coldbase'>
                <div className="row-icon"></div>
                <div className="row-body">
                    <div className="row-body-primary">
                        {this.props.label}
                    </div>
                    <div className="row-body-secondary">
                      {this.state.amount}
                    </div>
                </div>
            </Link>
        )
    },
    isCurrentlyActive: function() {
        var routes = this.getActiveRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name === 'shared';
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
                <ul className="page-breadcrumbs">
                  <li><span class="page-breadcrumbs-link">{this.props.alt}</span></li>
                </ul>
            </div>
            <div className="page-body">

            </div>
        </div>
        )
    }
});

module.exports.DetailView = ColdBaseDetailView;
module.exports.Link = ColdBaseLink;
