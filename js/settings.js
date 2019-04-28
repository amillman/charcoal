getStoredMode(function(storedMode) {
    var mode = storedMode;

    let modeSwitchInput = document.getElementById("theme_switch_input");
    modeSwitchInput.checked = _charcoalIsEnabled(mode);
    _updateOptionsUI(_charcoalIsEnabled(mode), mode);
    modeSwitchInput.addEventListener('change', (e) => {
        mode = _updateMode(e.target.checked);
        _updateOptionsUI(e.target.checked, mode);
    });

    listenForModeUpdates(function(newMode) {
        if (newMode == mode) {
            return;
        }

        mode = newMode;
        modeSwitchInput.checked = _charcoalIsEnabled(mode);
        _updateOptionsUI(modeSwitchInput.checked, mode);
    });
});

function _updateOptionsUI(isEnabled, mode) {
    let themeSelector = document.getElementById("theme_selector");
    if (!isEnabled) {
        themeSelector.classList.add("hidden");
        return;
    } else {
        themeSelector.classList.remove("hidden");
    }

    let options = themeSelector.getElementsByClassName("setting_row");
    for (var i=0, option; option = options[i]; i++) {
        let selectedCircle = option.getElementsByClassName("charcoal_toggle_circle")[0];
        if (selectedCircle) {
            selectedCircle.parentNode.removeChild(selectedCircle);
        }

        if (option.dataset.mode != mode) { continue; }

        let settingLabel = option.getElementsByClassName("setting_name_label")[0];
        settingLabel.insertAdjacentHTML("afterend", `
            <div class="charcoal_toggle_circle ${themeClassName(mode)}">
                <div class="charcoal_toggle" style="background-image:url('${toggleIconURL(mode)}')""></div>
            </div>
        `);
    }
}

function _updateMode(isEnabled) {
    var mode = isEnabled ? CHARCOAL_MODE : DEFAULT_MODE;
    updateStoredMode(mode, function() {});
    return mode;
}

function _charcoalIsEnabled(mode) {
    return mode == CHARCOAL_MODE;
}