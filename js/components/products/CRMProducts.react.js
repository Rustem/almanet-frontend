var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Header = require('../Header.react');
var Footer = require('../Footer.react');
var BreadCrumb = require('../common/BreadCrumb.react');


var CRMProducts = React.createClass({

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
                                <h1>Products</h1>
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
