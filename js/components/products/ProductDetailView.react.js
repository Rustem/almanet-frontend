var React = require('react');
var Router = require('react-router');
var VIEW_MODES = require('../../constants/CRMConstants').PRODUCT_VIEW_MODE;
var Crumb = require('../common/BreadCrumb.react').Crumb;
var IconSvg = require('../common/IconSvg.react');
var ProductEditForm = require('../../forms/ProductEditForm.react');
var ProductActionCreators = require('../../actions/ProductActionCreators');
var ProductStore = require('../../stores/ProductStore');

var ProductDetailView = React.createClass({

    mixins : [Router.State],

    componentWillMount: function() {
        this.setInternalState();
    },

    componentDidMount: function() {
        ProductStore.addChangeListener(this.onChangeState);
    },

    componentWillUnmount: function() {
        ProductStore.removeChangeListener(this.onChangeState);
    },

    componentWillReceiveProps: function(newProps) {
        this.setInternalState();
    },

    setInternalState: function() {
        this.mode = VIEW_MODES.READ;
        this.product = ProductStore.get(this.getParams().product_id);
    },

    onChangeState: function() {
        this.setInternalState();
        this.forceUpdate();
    },

    onEdit: function() {
        this.mode = VIEW_MODES.EDIT;
        this.forceUpdate();
    },

    onProductUpdate: function(newProduct) {
        ProductActionCreators.editProduct(this.product.id, newProduct);
    },

    renderRead: function() {
        return (
            <div>
            <div className="inputLine">
                <div className="row">
                  <div className="row-icon"></div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail text-large text-strong">
                      {this.product.name}
                    </div>
                    <div className="inputLine-negativeTrail text-secondary">
                      {this.product.description}
                    </div>
                  </div>
                </div>
            </div>

            <div className="space-vertical space-vertical--compact"></div>
            <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon">
                  </div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail">
                      <div className="text-caption text-secondary">
                        Итого заработано
                      </div>
                    </div>
                    <div className="inputLine-div">
                      {this.product.stat_value} KZT
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )
    },

    renderEdit: function() {
        return (
            <div className="inputLine">
                <div className="row">
                    <div className="row-icon"></div>
                    <ProductEditForm value={this.product} onHandleSubmit={this.onProductUpdate} />
                </div>
            </div>
        )
    },

    render: function() {
        return (
            <div className="page page--compact">
                <div className="page-header">
                    <Crumb />
                </div>
                <div className="page-body">
                    <a className="row row--oneliner row--link" onClick={this.onEdit}>
                        <div className="row-icon">
                            <IconSvg iconKey="edit" />
                        </div>
                        <div className="row-body">
                            Редактировать
                        </div>
                    </a>
                    <div className="space-vertical"></div>
                    {this.mode === VIEW_MODES.READ && this.renderRead() || this.renderEdit()}
                </div>
            </div>
        );
    }

});

module.exports = ProductDetailView;
