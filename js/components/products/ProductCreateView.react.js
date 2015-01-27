var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Crumb = require('../common/BreadCrumb.react').Crumb;
var ProductActionCreators = require('../../actions/ProductActionCreators');
var ProductCreateForm = require('../../forms/ProductCreateForm.react');
var ProductStore = require('../../stores/ProductStore');

var ProductCreateView = React.createClass({

    mixins: [Router.Navigation],

    getInitialState: function() {
        return {
            'products': ProductStore.getAll()
        }
    },

    componentDidMount: function() {
        ProductStore.addChangeListener(this.onChangeState);
    },

    componentWillUnmount: function() {
        ProductStore.removeChangeListener(this.onChangeState);
    },

    onChangeState: function() {
        this.setState(this.getInitialState(), function(prevState){
            // if created item
            if(_.size(this.prevState) < _.size(this.state)) {
                var product = ProductStore.getLatest();
                this.transitionTo('product_detail', {product_id: product.id});
            }
        }.bind(this, this.state))
    },

    onProductCreate: function(product) {
        ProductActionCreators.createProduct(product);
    },

    render: function() {
        return (
            <div className="page page--compact">
                <div className="page-header">
                    <Crumb />
                </div>
                <div className="page-body">
                    <div className="inputLine">
                        <div className="row">
                            <div className="row-icon"></div>
                            <ProductCreateForm onHandleSubmit={this.onProductCreate} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = ProductCreateView;
