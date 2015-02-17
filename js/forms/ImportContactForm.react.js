var React = require('react/addons');
var IconSvg = require('../components/common/IconSvg.react');
var waitUntil = require('../libs/wait');

var ImportContactForm = React.createClass({

    propTypes: {
        handleChoice: React.PropTypes.func.isRequired
    },

    handleClick: function(evt) {
        var fd_node = this.refs.file_dialog.getDOMNode();
        fd_node.click()
    },

    handleFileDialogChange: function(evt) {
        var files = evt.target.files, formData = new FormData();
        var reader = new FileReader(), file = files[0];
        reader.readAsBinaryString(files[0]);
        waitUntil()
            .interval(50)
            .times(20)
            .condition(function() {
                return this.readyState === 2
            }.bind(reader))
            .done(function(result) {
                if(result) {
                    this.props.handleChoice([file.name, btoa(reader.result)]);
                }
            }.bind(this))

    },

    render: function() {
        return (
            <form ref="contact_import_form">
                <input name="vcfile" type="file" onChange={this.handleFileDialogChange} ref="file_dialog" hidden />
                <button onClick={this.handleClick} type="button" className="btn btn--import">
                  <div className="row-body">
                    <div className="row-icon">
                        <IconSvg iconKey="upload" />
                    </div>
                    <div className="row-body">
                      Импорт
                    </div>
                  </div>
                </button>
                <div className="inputLine-caption">
                  Поддерживаемые форматы: vCard
                </div>
            </form>
        )
    }

});

module.exports = ImportContactForm;
