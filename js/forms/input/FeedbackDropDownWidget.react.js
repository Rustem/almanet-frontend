var _ = require('lodash');

var React = require('react/addons');
var cx = React.addons.classSet;
var DropDownBehaviour = require('../behaviours/DropDownBehaviour');
var IconSvg = require('../../components/common/IconSvg.react');

var FeedbackDropDownWidget = React.createClass({
    mixins: [DropDownBehaviour],

    propTypes: {
        choices: React.PropTypes.array.isRequired,
        choices_hash: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    getIconName: function(choice) {
        return _.findKey(this.props.choices_hash, function(val) {
            return val==choice[0];
        }).toLowerCase();
    },

    renderChoice: function(choice, idx) {
        return (
            <a key={'choice__' + idx} ref={'fb_choice__' + choice[0]} onClick={this.onChoice.bind(null, idx)}  className="row row--oneliner row--link">
                <div className="row-icon text-good">
                    <IconSvg iconKey={this.getIconName(choice)} />
                </div>
                <div className="row-body text-secondary">
                  {choice[1]}
                </div>
            </a>
        )
    },

    renderDefaultChoice: function() {
        return (
            <div>
                <div className="row-icon">
                    <IconSvg iconKey="event-type" />
                </div>
                <div className="row-body">
                    Выбрать статус
                </div>
            </div>
        )
    },

    copyRenderedChoice: function() {
        var value = this.props.value,
            idx = -1, choice = null;
        for(var i = 0; i<this.props.choices.length; i++) {
            var cur = this.props.choices[i];
            if(cur[0] === value) {
                idx = i;
                choice = cur;
                break;
            }
        }
        return (
            <a key={'choice__' + idx} className="row row--oneliner row--link">
                <div className="row-icon text-good">
                    <IconSvg iconKey={this.getIconName(choice)} />
                </div>
                <div className="row-body text-secondary">
                  {choice[1]}
                </div>
            </a>
        )
    },

    render: function() {
        var className = cx({
            'dropdown': true,
            'open': this.state.isOpen
        });
        return (
            <div className="modal-inputLine">
                <div className={className}>
                    <button ref="menuToggler" onKeyDown={this.onKeyDown} onClick={this.onMenuToggle} type="button" className="row row--oneliner row--dropdown">
                        {this.props.value && this.copyRenderedChoice() || this.renderDefaultChoice()}
                    </button>
                    <div className="dropdown-menu dropdown-menu--wide">
                        {this.props.choices.map(this.renderChoice)}
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = FeedbackDropDownWidget;
