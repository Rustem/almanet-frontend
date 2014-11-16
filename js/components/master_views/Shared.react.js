/**
 * @author xepa4ep
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var cx        = React.addons.classSet;
var Router = require('react-router');
var ActiveState = Router.ActiveState;
var Link = Router.Link;
var IconSvg = require('../common/IconSvg.react');
var ContactActionCreators = require('../../actions/ContactActionCreators');
var ShareStore = require('../../stores/ShareStore');
var ContactStore = require('../../stores/ContactStore');
var AppContextMixin = require('../../mixins/AppContextMixin');
var Form = require('../../forms/Form.react');
var inputs = require('../../forms/input');
var SVGCheckbox = inputs.SVGCheckbox;
var Input = inputs.Input;
var Div = require('../../forms/Fieldset.react').Div;


var SharedContactLink = React.createClass({
    mixins: [AppContextMixin, ActiveState],

    statics: {
        getState: function() {
            return {
                'amount': ShareStore.size(),
                'hasNewItems': ShareStore.hasNew()
            }
        }
    },

    propTypes: {
        label: React.PropTypes.string,
    },

    getInitialState: function() {
        return SharedContactLink.getState();
    },
    componentDidMount: function() {
        ShareStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ShareStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(SharedContactLink.getState());
    },

    render: function() {
        var className = cx({
            'row': true,
            'row-oneliner': true,
            'row--link': true,
            'active': this.isCurrentlyActive(),
            'new': this.state.hasNewItems
        });
        return (
            <Link className={className} to='shared'>
                <div className="row-icon">
                    <IconSvg iconKey="inbox" />
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
        var routes = this.getActiveRoutes();
        var route = routes[routes.length - 1];
        if(!route) { return false; }
        return route.name === 'shared' || (route.props.isDefault && route.props.path === '/');
    }
});


var FilterBar = React.createClass({
    propTypes: {
        value: React.PropTypes.object,
        onHandleUserInput: React.PropTypes.func
    },
    getDefaultValue: function() {
        return {
            filter_text: 'dasdsa',
            select_all: false
        }
    },
    render: function() {
        return (
            <Form onUpdate={this.onHandleUpdate} value={this.getDefaultValue()} name='share:filter_contacts_form' ref='filter_contacts_form'>
                <Div className="page-header-filterContainer">
                    <Div className="page-header-filter row">
                        <Div className="row-icon">
                            <IconSvg iconKey='search' />
                        </Div>
                        <Div className="row-body row-body--inverted">
                            <Div className="row-body-secondary">
                                <IconSvg iconKey='arrow-down' />
                            </Div>
                            <Div className="row-body-primary">
                                <Input name="filter_text" type="text" className="input-filter" placeholder="Фильтр" />
                            </Div>
                        </Div>
                    </Div>
                </Div>
                <Div className="page-header-controls row">
                    <Div className="row-body-primary">
                        <SVGCheckbox name="select_all" className="text-secondary" label="Выбрать все" />
                    </Div>
                    <div className="row-body-secondary">
                        <a href="#" className="text-secondary">Редактировать список</a>
                    </div>
                </Div>


            </Form>
        )
    },
    onHandleUpdate: function(value) {
        var form = this.refs.filter_contacts_form;
        var errors = form.validate();
        if(!errors) {
            this.props.onHandleUserInput(form.value());
        } else {
            alert(errors);
        }
    }

});

var ShareListItem = React.createClass({
    propTypes: {
        share: React.PropTypes.object,
        is_selected: React.PropTypes.bool,
        onItemToggle: React.PropTypes.func
    },

    getContactName: function() {
        return "Мегагаз"
    },
    getAuthorName: function() {
        return 'Санжар'
    },
    getTimeAt: function() {
        return '11:07, 7 окт 14'
    },
    render: function() {
        var share = this.props.share;
        return (
            <div className="stream-item new">
                <SVGCheckbox
                    name={'share__' + share.id}
                    label={this.getContactName()}
                    className='row'
                    value={this.props.is_selected}
                    onValueUpdate={this.props.onItemToggle.bind(null, share.id)} />
                <div className="stream-item-extra row">
                    <a href="#" className="row-icon">
                      <figure className="icon-userpic">
                        <img src="assets/img/userpics/sanzhar.png" alt="" />
                      </figure>
                    </a>
                    <div className="row-body">
                      <div className="text-caption text-secondary">
                        <a href="#" className="text-secondary">{this.getAuthorName()}</a> в {this.getTimeAt()}
                      </div>
                    </div>
                </div>
            </div>
        )
    }
});

var SharesList = React.createClass({
    propTypes: {
        shares: React.PropTypes.array,
    },
    getInitialState: function() {
        return {}
    },

    onItemToggle: function(share_id, value) {
        var val = null;
        this.state[share_id] = value['share__' + share_id];
        this.setState(this.state);
    },

    render: function() {
        var self = this;
        var shareListItems = this.props.shares.map(function(share) {
            var is_selected = self.state[share.id] || false;
            return(
                <ShareListItem
                    key={'share__' + share.id}
                    share={share}
                    is_selected={is_selected}
                    onItemToggle={self.onItemToggle} />
            )
        });
        return (
            <div className="page-body">
                {shareListItems}
            </div>
        )
    }
});

var SharedContactDetailView = React.createClass({
    propTypes: {
        label: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            shares: ShareStore.getAll()
        }
    },

    getShares: function() {
        return this.state.shares;
    },

    getSharesNumber: function() {
        return this.getShares().length;
    },
    componentDidMount: function() {
        ShareStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(nextProps, nextState) {
        ShareStore.removeChangeListener(this._onChange);
    },
    onHandleUserInput: function(value) {
        console.log('handle', value);
    },

    render: function() {
        return (
        <div className="page">
            <div className="page-header">
                <ul className="page-breadcrumbs">
                  <li><span class="page-breadcrumbs-link">{this.props.alt}</span></li>
                </ul>
                <FilterBar onHandleUserInput={this.onHandleUserInput} />
            </div>
            <SharesList shares={this.getShares()} />
        </div>
        )
    },
    _onChange: function() {
        this.setState({shares: ShareStore.getAll()});
    }
});



module.exports.DetailView = SharedContactDetailView;
module.exports.Link = SharedContactLink;
