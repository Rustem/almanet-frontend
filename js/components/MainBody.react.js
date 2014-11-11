/**
 * @author xepa4ep
 * @jsx React.DOM
 */
var React = require('react');
var master_views = require('./master_views');
var MasterDetailBreadCrumbs = require('./common/BreadCrumb.react').MasterDetailBreadCrumbs;

var MainBody = React.createClass({

    render: function() {
        return (
            <div>
                <div className="body-master">
                    <div className="page page--compact">
                        <div className="page-header">
                            <MasterDetailBreadCrumbs isMaster={true} />
                        </div>
                        <div className="page-body">
                            <master_views.Shared.Link label="Входящие" />
                            <master_views.ColdBase.Link label="Холодная база" />
                        </div>
                    </div>
                </div>
                <div className="body-detail">
                    {this.props.activeRouteHandler()}
                </div>
            </div>
        )
    }

});

module.exports = MainBody;



/** @jsx React.DOM */

// var Router = ReactRouter;
// var Route = ReactRouter.Route;
// var Routes = ReactRouter.Routes;
// var Link = ReactRouter.Link;
// var DefaultRoute = ReactRouter.DefaultRoute;

// var BreadCrumb = React.createClass({
//   mixins: [Router.ActiveState],
//   render: function() {
//     var crumbs = [];
//     var routes = this.getActiveRoutes().filter(function (r) { return !r.props.isDefault; });
//     routes.forEach(function (route, i, arr) {
//       var name = route.props.alt?route.props.alt:route.props.handler.displayName;
//       var link = name;
//       if (i != arr.length-1) {
//         link = <Link to={route.props.path}>{name}</Link>;
//       }
//       crumbs.push(
//         <li key={route.props.path+''+crumbs.length}>
//           {link}
//         </li>
//       );
//     });
//     return <ul className="crumbs">{crumbs}</ul>;
//   }
// });

// var App = React.createClass({
//   render: function() {
//     return (<div>
//      <BreadCrumb />
//      <this.props.activeRouteHandler />
//     </div>);
//   }
// });

// var Main = React.createClass({
//   render: function() {
//     return (
//     <div>
//      <div><Link to='/dashboard'>-> Dash</Link></div>
//     </div>);
//   }
// });

// var DashBoard = React.createClass({
//   render: function() {
//     return (
//     <div>
//       <div><Link to='/dashboard/overview'>-> Overview</Link> </div>
//       <div><Link to='/dashboard/metrics'>-> Metrics</Link> </div>
//       <div><this.props.activeRouteHandler /></div>
//     </div>);
//   }
// });

// var Overview = React.createClass({
//   render: function() {
//     return (<div>Overview1 {this.props.alt}</div>);
//   }
// });


// var routes = (
//   <Routes>
//     <Route handler={App} alt='Home'>
//       <DefaultRoute handler={Main} />
//       <Route path='/dashboard' handler={DashBoard} alt='DashBoard'>
//          <Route path='/dashboard/overview' handler={Overview} alt='Overview'/>
//          <Route path='/dashboard/metrics' handler={Overview} alt='Metrics'/>
//       </Route>
//     </Route>
//   </Routes>
// );

// React.renderComponent(routes, document.body);
