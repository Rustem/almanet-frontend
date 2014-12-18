/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var cx        = React.addons.classSet;
var Router = require('react-router');
var capitalize = require('../../../utils').capitalize;
var fuzzySearch = require('../../../utils').fuzzySearch;
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../../common/IconSvg.react');
var ActivityStore = require('../../../stores/ActivityStore');
var UserStore = require('../../../stores/UserStore');
var AppContextMixin = require('../../../mixins/AppContextMixin');

function get_mentions_number(user) {
    return _.size(ActivityStore.getMentions(user));
}


var MentionsLink = React.createClass({
    mixins: [Router.State, AppContextMixin],
    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return {'amount': get_mentions_number(this.getUser())};
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({'amount': get_mentions_number(this.getUser())});
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive()
        });
        return (
            <Link className={className} to='mentions'>
                <div className="row-icon">
                    <IconSvg iconKey="mentions" />
                </div>
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
        var routes = this.getRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name === 'mentions';
    }
});


var MentionsDetailView = React.createClass({
    mixins: [Router.Navigation, AppContextMixin],
    propTypes: {
        label: React.PropTypes.string
    },

    componentDidMount: function() {
        ActivityStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActivityStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },
    
    render: function() {
        return (
            <div className="page page--noHeaderOpts">
                <div className="page-header">
                    <h1>Mentions</h1>
                </div>
                <div className="page-body">
                    <h4>Mentions</h4>
                </div>
            </div>
        )
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    }
});

module.exports.DetailView = MentionsDetailView;
module.exports.Link = MentionsLink;