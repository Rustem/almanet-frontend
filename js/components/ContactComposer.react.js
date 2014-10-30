/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react');
var IconSvg = require('./common/IconSvg.react');
var DropDownMixin = require('./mixins/DropDownMixin.react');

var ESCAPE_KEY_CODE = 27;

var ContactComposerButton = React.createClass({

  getDefaultProps: function() {
    return {
      onClick: undefined,
      disabled: false,
      className: undefined
    };
  },

  render: function() {
    return (
      <button className="nav-btn" onClick={this.props.onClick} disabled={this.props.disabled} data-toggle="dropdown" type="button">
        <div className="row-body">
          <div className="row-icon">
            <IconSvg iconKey="add" />
          </div>
          <div className="row-body">Новый контакт / импорт</div>
        </div>
      </button>
    );
  }
});


var ContactComposerForm = React.createClass({
  render: function() {
    return (
      <div className="dropdown-menu" style={{height: '310px'}}>
        <div className="addContact">
          <div className="addContact-import">
            <input type="file" hidden />
            <button type="button" className="btn btn--import">
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
              Поддерживаемые форматы: ..., ...
            </div>
          </div>
          <div className="addContact-edit">
              <div className="inputLine">
                <figure className="inputLine-image">
                  <div className="dropdown dropdown--right dropdown--imageOptions">
                    <button className="btn--imageOptions" type="button" data-toggle="dropdown">
                      <IconSvg iconKey="image" />
                    </button>
                    <div className="dropdown-menu">
                      <ul className="dropdown-menu-list">
                        <li>
                          <button className="dropdown-menu-link" type="button">
                            Загрузить изображение
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-menu-link" type="button">
                            Удалить
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                </figure>
              </div>
              <div className="inputLine">
                <div className="row">
                  <div className="row-icon"></div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail">
                      <div className="input-div input-div--strong" contenteditable data-placeholder="Имя">
                        Yo
                      </div><div className="input-div input-div--strong" contenteditable data-placeholder="Фамилия">
                        Yo
                      </div>
                    </div>
                    <div className="inputLine-negativeTrail">
                      <div className="input-div text-secondary" contenteditable data-placeholder="Компания">Yo</div>
                    </div>

                    <label className="row input-checkboxCompact">
                      <div className="row-icon">
                        <input type="checkbox" checked />
                        <div className="checkbox-icon">
                          <IconSvg iconKey="checkbox-checked" />
                          <IconSvg iconKey="checkbox" />
                        </div>
                      </div>
                      <div className="row-body">
                        Компания
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-vertical space-vertical--compact"></div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon">
                    <button type="button">
                      <IconSvg iconKey="icon--remove" />
                    </button>
                  </div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail row-body--aligned">
                      <div className="select">
                        <select>
                          <option value="">mobile</option>
                        </select>
                      </div>
                    </div>
                    <div className="inputLine-div">
                      <div className="input-div" contenteditable data-placeholder="Телефон">
                        +7 777 7777777
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon">
                  </div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail row-body--aligned">
                      <div className="select">
                        <select>
                          <option value="">mobile</option>
                        </select>
                      </div>
                    </div>
                    <div className="inputLine-div">
                      <div className="input-div" contenteditable data-placeholder="Телефон">
                        Телефон
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-verticalBorder"></div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon">
                  </div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail row-body--aligned">
                      <div className="select">
                        <select>
                          <option value="">work</option>
                        </select>
                      </div>
                    </div>
                    <div className="inputLine-div">
                      <div className="input-div" contenteditable data-placeholder="Телефон">
                        Email
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-verticalBorder"></div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon">
                  </div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail row-body--aligned">
                      <div className="select">
                        <select>
                          <option value="">website</option>
                        </select>
                      </div>
                    </div>
                    <div className="inputLine-div">
                      <div className="input-div" contenteditable data-placeholder="Телефон">
                        URL
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-verticalBorder"></div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon"></div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail">
                      <label className="text-caption text-secondary row-body--aligned">
                        День рождения
                      </label>
                    </div>
                    <div className="inputLine-div">
                      <div className="input-div" contenteditable data-placeholder="Телефон">
                        День/Месяц/Год
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-verticalBorder"></div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon"></div>
                  <div className="row-body">
                    <div className="row-body-primary">
                      <div className="inputLine-negativeTrail row-body--aligned">
                        <div className="select">
                          <select>
                            <option value="">Работа</option>
                          </select>
                        </div>
                      </div>

                      <div className="inputLine-div">
                        <div className="input-div" contenteditable data-placeholder="Street">Улица</div>
                      </div>
                      <div className="inputLine-div">
                        <div className="input-div" contenteditable data-placeholder="City">City</div>
                        <div className="input-div" contenteditable data-placeholder="Postal district">Postal district</div>
                      </div>

                      <div className="inputLine-div">
                        <div className="input-div" contenteditable data-placeholder="Street">Province</div>
                      </div>

                      <div className="inputLine-div">
                        <div className="input-div" contenteditable data-placeholder="Street">Country</div>
                      </div>

                      <div className="inputLine-div">
                        <div className="input-div" contenteditable data-placeholder="Postal code">Postal code</div>
                      </div>

                    </div>
                    <div className="row-body-secondary inputLine-negativeTrail">
                      <a href="#">Формат адреса</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-verticalBorder"></div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon">
                  </div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail row-body--aligned">
                      <div className="select">
                        <select>
                          <option value="">Custom</option>
                        </select>
                      </div>
                    </div>
                    <div className="inputLine-div">
                      <div className="input-div" contenteditable data-placeholder="Custom field">
                        ...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-verticalBorder"></div>

              <div className="inputLine inputLine--vcardRow">
                <div className="row">
                  <div className="row-icon">
                  </div>
                  <div className="row-body">
                    <div className="inputLine-negativeTrail row-body--aligned">
                      <label className="text-caption text-secondary row-body--aligned">
                        Заметка
                      </label>
                    </div>
                    <div className="inputLine-div">
                      <div className="input-div input-div--area" contenteditable data-placeholder="Custom field">

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-verticalBorder"></div>

              <div className="inputLine text-right">
                <button className="btn btn--save" type="button">Сохранить</button>
              </div>


            </div>
        </div>

      </div>
    )
  }
});


// Main Component

var ContactComposer = React.createClass({
    // mixins: [DropDownMixin],

    getInitialState: function() {
        return {
          isOpen: false
        }
    },

    render: function() {
        var stateClass = this.state['isOpen'] && 'open' || undefined;
        var classNames = ["dropdown", "dropdown--inline", "dropdown--right"];
        classNames.push(stateClass);
        classNames = _.compact(classNames)
        return (
          <div ref="contactComposer" onKeyDown={this.onKeyDown} className={classNames.join(' ')}  data-verticalfit=".body-master">
            <ContactComposerButton
              ref="menuToggler"
              onClick={this.onMenuToggle} />
            <ContactComposerForm
              ref="contactForm"
              isOpen={this.isOpen()} />
          </div>
        );
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.isOpen()) {
        }
    },
    onMenuToggle: function(evt) {
        this.setState({isOpen: !this.isOpen()});
    },
    onKeyDown: function(evt) {
      if(evt.keyCode == ESCAPE_KEY_CODE) {
        evt.preventDefault();
        this.setState({isOpen: false});
      }
    },
    isOpen: function() {
      return this.state.isOpen;
    }
});

module.exports = ContactComposer;
