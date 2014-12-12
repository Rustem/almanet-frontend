var _ = require('lodash');

var React = require('react/addons');
var cx = React.addons.classSet;
var DropDownBehaviour = require('../behaviours/DropDownBehaviour');
var IconSvg = require('../../components/common/IconSvg.react');

var DescriptionDropDownWidget = React.createClass({
    mixins: [DropDownBehaviour],
    propTypes: {
        choices: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    renderChoice: function(choice, idx) {
        return (
            <li>
                <a key={'choice__' + idx} onClick={this.onChoice.bind(null, idx)} className="dropdown-menu-link">
                   {choice[1]}
                </a>
            </li>
        );
    },

    render: function() {
        var className = cx({
            'dropdown': true,
            'open': this.state.isOpen
        });
        return (
            <div className={className}>
                <button ref="menuToggler" onKeyDown={this.onKeyDown} onClick={this.onMenuToggle} type="button" className="row row--oneliner row--dropdown">
                    <div className="row-body">
                        <div className="row-body-primary">
                            Или выберите из шаблона
                        </div>
                        <div className="row-body-secondary">
                            <div className="row-icon">
                                <IconSvg iconKey="arrow-down" />
                            </div>
                        </div>
                    </div>
                </button>
                <div className="dropdown-menu dropdown-menu--wide">
                    <div className="dropdown-menu-body">
                        <ul className="dropdown-menu-list">
                            {this.props.choices.map(this.renderChoice)}
                        </ul>
                    </div>
                </div>
          </div>
        );
    }
});

module.exports = DescriptionDropDownWidget;
