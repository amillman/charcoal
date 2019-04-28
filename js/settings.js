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

    themeSelector.getElementsByClassName("setting_row");
}

function _updateMode(isEnabled) {
    var mode = isEnabled ? CHARCOAL_MODE : DEFAULT_MODE;
    updateStoredMode(mode, function() {});
    return mode;
}

function _charcoalIsEnabled(mode) {
    return mode == CHARCOAL_MODE;
}