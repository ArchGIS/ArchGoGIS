"use strict";

(function() {
  // 1) Отрисовать key-only поля ввода
  // 2) Добавить логику/вёрстку для отображения неключевых полей
  // 3) Закрепить за ключевыми полями ввода события опроса бд
  // 4) 
  function Research(id) {
    App.node.Base.call(this, id, Research);
    
    this.researchId = 0;

    this.afterLoad = () => {
      /*
      this.$.inputs.author.autocomplete({
        "minLength": 3,
        "source": (request, response) => response(_.map(
          App.hquery.findAuthor(request.term), 
          author => ({"id": author.id, "label": author.name})
        )),
        "change": (event, ui) => {
          if (ui.item) {
            this.authorId = ui.item.id;
            this.$.statuses.author.setOkStatus();
          } else {
            this.$.inputs.author.val("");
            this.$.statuses.author.setErrorStatus(":/");
          }
        }
      });
      this.$.inputs.author.on("focus", () => {
        this.$.inputs.author.autocomplete("search");
      });

      if (this.researchId) {
        // 1) вводишь имя автора
        // 2) вводишь год исследования
        // 3) если не найдено - отобразить поля для создания нового исследования
      }
      */
    };
  }
  // #FIXME: шаблон должен собираться из schema.
  Research.render = research => `
    <div id="node-key-inputs-box">
      <label>
        ${t("Research.props.author")}
        <input id="node-author" type="text" value="${research.props.author}">
        <div id="node-author-status" class="status-error">&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </label>
      <br>
      <label>
        ${t("Research.props.year")}
        <input id="node-year" type="text" value="${research.props.year}">
      </label>
    </div>
    <div id="node-inputs-box">
      <label>
        ${t("Research.props.description")}
        <textarea id="node-description">${research.props.description}</textarea> 
      </label>
    </div>
  `;
  Research.actions = {
    "add": [
      "ArchMap",
      "Excavations",
      "CoAuthor"
    ]
  };
  Research.schema = {
    "description": {
      "type": T_TEXT
    },
    "year": {
      "type": T_YEAR,
      "key": true
    }
  };

  App.node.Research = Research;
}());