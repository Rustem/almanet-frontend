/**
 * @jsx React.DOM
 */
var _ = require('lodash')
var React = require('react');

var IconSvg = React.createClass({
    getDefaultProps: function() {
        return {
            iconKey: undefined,
            iconClass: 'icon',
        };
    },
    render: function() {
        var classes = _.compact([
            this.props.iconClass,
            'icon--' + this.props.iconKey
        ])
        return (
            <figure className={classes.join(' ')}>
                <svg version="1.1" dangerouslySetInnerHTML={{__html: "<use xlink:href=\"#" + this.props.iconKey + "\"></use>"}}>
                </svg>
            </figure>
        );
    }

});

module.exports = IconSvg;
