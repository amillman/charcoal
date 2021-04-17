function setupCharcoalSettings() {
    getStoredSettings(function(storedSettings) {
        var settings = storedSettings;
        _updateOptionsUI(settings);

        // load appearance click events

        let appearanceSelector = document.getElementById("appearance_selector");
        let appearanceElements = appearanceSelector.getElementsByClassName("appearance_item");
        for (var i=0, appearanceElement; appearanceElement = appearanceElements[i]; i++) {
            appearanceElement.onclick = function() {
                let newAppearance = this.dataset.appearance;
                if (newAppearance == null) { return; }

                settings.appearance = newAppearance;

                updateStoredSettings(settings, function() {
                    _updateOptionsUI(settings);
                });
            };
        }

        // load theme click events

        let themeSelector = document.getElementById("theme_selector");
        let themeElements = themeSelector.getElementsByClassName("setting_row");
        for (var i=0, themeElement; themeElement = themeElements[i]; i++) {
            themeElement.onclick = function() {
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
            _updateOptionsUI(settings);
        });

        listenForSystemThemeUpdates(function() {
            _updateOptionsUI(settings);
        });
    });
}

function _updateOptionsUI(settings) {
    // appearance

    let appearanceSelector = document.getElementById("appearance_selector");
    let appearanceElements = appearanceSelector.getElementsByClassName("appearance_item");
    for (var i=0, appearanceElement; appearanceElement = appearanceElements[i]; i++) {
        if (settings.appearance == appearanceElement.dataset.appearance) {
            appearanceElement.classList.add("active");
        } else {
            appearanceElement.classList.remove("active");
        }
    }

    // themes

    let themeSelector = document.getElementById("theme_selector");
    let themeElements = themeSelector.getElementsByClassName("setting_row");
    for (var i=0, themeElement; themeElement = themeElements[i]; i++) {
        // Remove existing toggle
        let selectedCircle = themeElement.getElementsByClassName("charcoal_toggle")[0];
        if (selectedCircle) {
            selectedCircle.parentNode.removeChild(selectedCircle);
        }

        if (themeElement.dataset.theme == settings.preferredTheme) {
            themeElement.classList.add("active");
        } else {
            themeElement.classList.remove("active");
        }

        let themeURL = settings.currentTheme() == DEFAULT_MODE ? themeIconURL(CHARCOAL_MODE) : themeIconURL(themeElement.dataset.theme);

        themeElement.insertAdjacentHTML("afterbegin", `
            <div class="charcoal_toggle ${themeClassName(themeElement.dataset.theme)}" style="background-image:url('${themeURL}')""></div>
        `);
    }
}
