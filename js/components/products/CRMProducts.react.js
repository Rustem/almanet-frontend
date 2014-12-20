var React = require('react');
var Router = require('react-router')
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var BreadCrumb = require('../common/BreadCrumb.react');
var IconSvg = require('../common/IconSvg.react');
var ProductStore = require('../../stores/ProductStore');
var utils = require('../../utils');

var CRMProducts = React.createClass({

    getInitialState: function() {
        return {
            products: ProductStore.getAll()
        }
    },

    renderProductDetailLink: function(product) {
        return (
            <Link key={'js-product__' + product.id} to="product_detail" params={{product_id: product.id}} className="row row--oneliner row--link">
                <div className="row-icon"></div>
                    <div className="row-body">
                        <div className="row-body-primary">
                            {utils.capitalize(product.name)}
                    </div>
                </div>
            </Link>
        )
    },

    render: function() {
        return (
            <div>
                <Header />
                <div>
                    <div className="body-master">
                        <div className="page page--compact">
                            <div className="page-header">
                                <BreadCrumb slice={[1, -1]} />
                            </div>
                            <div className="page-body">
                                <div className="row row--oneliner">
                                    <div className="row-body">
                                        <Link to="product_new" className="row-body-primary">
                                            <div className="row-icon">
                                                <IconSvg iconKey="add" />
                                            </div>
                                            <div className="row-body">
                                                <strong>Новый продукт</strong>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                {this.state.products.map(this.renderProductDetailLink)}
                            </div>
                        </div>
                    </div>
                    <div className="body-detail">
                        <RouteHandler />
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CRMProducts;
