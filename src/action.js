/** last changed: 2022.3.6 */

Shuang.app.action = {
  init() {
    /** Rendering **/
    function renderSelect(target, options, callback) {
      options.forEach((option) => {
        const opt = document.createElement("option");
        if (option.disabled) opt.setAttribute("disabled", "disabled");
        opt.innerText = option.text || option;
        target.appendChild(opt);
      });
      target.onchange = (e) => {
        callback(e.target.value);
      };
    }

    const schemeList = Object.values(Shuang.resource.schemeList);
    const schemes = {
      common: schemeList.filter((scheme) => !scheme.endsWith("*")),
      uncommon: schemeList
        .filter((scheme) => scheme.endsWith("*") && !scheme.endsWith("**"))
        .map((scheme) => scheme.slice(0, -1)),
      rare: schemeList
        .filter((scheme) => scheme.endsWith("**"))
        .map((scheme) => scheme.slice(0, -2)),
    };
    const schemeOptions = [
      { disabled: true, text: "常见" },
      ...schemes.common,
      { disabled: true, text: "小众" },
      ...schemes.uncommon,
      { disabled: true, text: "爱好者" },
      ...schemes.rare,
    ];

    renderSelect($("#scheme-select"), schemeOptions, (value) => {
      Shuang.app.setting.setScheme(value);
    });

    renderSelect(
      $("#keyboard-layout-select"),
      [...Object.values(Shuang.resource.keyboardLayoutList)],
      (value) => {
        Shuang.app.setting.setKeyboardLayout(value);
      }
    );

    renderSelect(
      $("#mode-select"),
      Object.values(Shuang.app.modeList).map((mode) => mode.name),
      (value) => {
        Shuang.app.setting.setMode(value);
        this.next();
      }
    );

    /** Reset Configs **/
    Shuang.app.setting.reload();

    /** Setting First Question **/
    Shuang.core.current = Shuang.core.model.getNextChar();
    $("#dict").innerText = Shuang.core.current.question;

    Shuang.app.setting.updateKeysHint();

    /** Listen Events **/
    document.addEventListener("keydown", (e) => {
      if (["Enter"].includes(e.key)) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          event.returnValue = false;
        }
      }
    });
    document.addEventListener("keyup", (e) => {
      this.keyPressed(e);
    });
    $("#pic-switcher").addEventListener("change", (e) => {
      Shuang.app.setting.setPicVisible(e.target.checked);
    });
    $("#dark-mode-switcher").addEventListener("change", (e) => {
      Shuang.app.setting.setDarkMode(e.target.checked);
    });
    $("#show-keys").addEventListener("change", (e) => {
      Shuang.app.setting.setShowKeys(e.target.checked);
    });
    $("#show-pressed-key").addEventListener("change", (e) => {
      Shuang.app.setting.setShowPressedKey(e.target.checked);
    });
    $("#batch-size").addEventListener("focusout", (e) => {
      const batchSize = $("#batch-size").value;
      Shuang.app.setting.setBatchSize(batchSize);
    });
    window.addEventListener(
      "resize",
      Shuang.app.setting.updateKeysHintLayoutRatio
    );
    window.resizeTo(window.outerWidth, window.outerHeight);
    $("#option-switcher").addEventListener("click", (e) => {
      if ($("#option-container").classList.contains("option-collapsed")) {
        $("#option-container").classList.remove("option-collapsed");
      } else {
        $("#option-container").classList.add("option-collapsed");
      }
    });
    $("#a").addEventListener("input", (e) => {
      const curVal = $("#a").value;
      const curKey = curVal.slice(-1);
      Shuang.app.setting.updatePressedKeyHint(curKey);
      setTimeout(() => {
        if (Shuang.core.statistics.count == 0) {
          Shuang.core.statistics.startAt = new Date().getTime();
        }
        switch (this.judge()) {
          case 0:
            $("#workspace").classList.add("wrong");
            setTimeout(() => {
              $("#workspace").classList.remove("wrong");
            }, 250);
            Shuang.core.statistics.countWrong += 1;
            Shuang.app.setting.updateStatistics();
            this.redo();
            break;
          case 1:
            break;
          case 2:
            $("#workspace").classList.add("right");
            setTimeout(() => {
              $("#workspace").classList.remove("right");
            }, 250);
            Shuang.core.statistics.count += 1;
            if (
              Shuang.core.statistics.count >= Shuang.core.statistics.batchSize
            ) {
              // next batch
              this.resetRound();
              this.finishRound();
              return;
            } else {
              Shuang.app.setting.updateStatistics();
              this.next();
            }
            break;
          default:
            break;
        }
      }, 50);
    });

    setInterval(() => {
      Shuang.app.setting.updateStatistics();
    }, 1000);
    /** All Done **/
    this.redo();
  },
  keyPressed(e) {
    switch (e.key) {
      case "Enter":
        this.resetRound();
        this.next();
        break;
      default:
        break;
    }
  },
  judge() {
    return Shuang.core.current.judge($("#a").value);
  },
  redo() {
    $("#a").value = "";
  },
  next() {
    this.redo();
    Shuang.core.current = Shuang.core.model.getNextChar();
    if (Shuang.core.history.includes(Shuang.core.current.question)) this.next();
    else
      Shuang.core.history = [
        ...Shuang.core.history,
        Shuang.core.current.question,
      ].slice(-1);
    $("#dict").innerText = Shuang.core.current.question;

    // Update Keys Hint
    Shuang.app.setting.updateKeysHint();
  },
  finishRound() {
    $("#dict").innerText = `完成`;
  },
  resetRound() {
    $("#a").value = ""
    Shuang.core.statistics.count = 0;
    Shuang.core.statistics.countWrong = 0;
    Shuang.core.statistics.startAt = 0;
  },
};
