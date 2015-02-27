/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;
var RequestStore = require('../../stores/RequestStore');
var Shutter = require('./Shutter.react');
var initial = require('../../initial');



var InitialLoadingView = React.createClass({

    componentDidMount: function() {
        initial.initial_load(initial.global_render);

        RequestStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        RequestStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        
    },


    render: function() {
        var classes = cx({
            'body-container': true,
            'display-shutter': true,
        });
        return (
            <div className={classes}>
                <Shutter />
            </div>
        )
    }
});

module.exports = InitialLoadingView;
