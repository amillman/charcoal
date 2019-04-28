function runSettings() {
    getStoredSettings(function(storedSettings) {
        var settings = storedSettings;

        let modeSwitchInput = document.getElementById("theme_switch_input");
        modeSwitchInput.checked = settings.isEnabled;
        _updateOptionsUI(settings);

        modeSwitchInput.addEventListener('change', (e) => {
            settings.isEnabled = e.target.checked;
            updateStoredSettings(settings, function() {
                _updateOptionsUI(settings);
            });
        });

        let themeSelector = document.getElementById("theme_selector");
        let options = themeSelector.getElementsByClassName("setting_row");
        for (var i=0, option; option = options[i]; i++) {
            option.onclick = function() {
                if (themeSelector.classList.contains("disabled")) {
                    return;
                }

                let newTheme = this.dataset.theme;
                if (newTheme == null) { return; }
                settings.preferredTheme = newTheme;
                updateStoredSettings(settings, function() {
                    _updateOptionsUI(settings);
                });
            };
        }

        listenForSettingsUpdates(function(newSettings) {
            if (newSettings == settings) {
                return;
            }

            settings = newSettings;
            modeSwitchInput.checked = settings.isEnabled;
            _updateOptionsUI(settings);
        });
    });
}

function _updateOptionsUI(settings) {
    let themeSelector = document.getElementById("theme_selector");
    if (!settings.isEnabled) {
        themeSelector.classList.add("disabled");
    } else {
        themeSelector.classList.remove("disabled");
    }

    let options = themeSelector.getElementsByClassName("setting_row");
    for (var i=0, option; option = options[i]; i++) {
        let selectedCircle = option.getElementsByClassName("charcoal_toggle_circle")[0];
        if (selectedCircle) {
            selectedCircle.parentNode.removeChild(selectedCircle);
        }

        if (option.dataset.theme != settings.preferredTheme) { continue; }

        let settingLabel = option.getElementsByClassName("setting_name_label")[0];
        settingLabel.insertAdjacentHTML("afterend", `
            <div class="charcoal_toggle_circle ${themeClassName(settings.preferredTheme)}">
                <div class="charcoal_toggle" style="background-image:url('${themeIconURL(settings.preferredTheme)}')""></div>
            </div>
        `);
    }
}
