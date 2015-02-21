var React = require('react');

var Shutter = React.createClass({
  render: function() {
    return (
      <div className='shutter'>
        <div className='shutter-spinner' />
      </div>
    );
  }
});

module.exports = Shutter;