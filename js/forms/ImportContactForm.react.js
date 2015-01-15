var React = require('react/addons');
var IconSvg = require('../components/common/IconSvg.react');

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
        for(var i = 0; i<files.length; i++) {
            // todo(xepa4ep): might be validate here
            formData.append('vcards[]', files[i], files[i].name);
        }
        this.props.handleChoice(formData);
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
