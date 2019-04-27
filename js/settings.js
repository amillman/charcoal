getStoredMode(function(storedMode) {
    var mode = storedMode;

    let modeSwitchInput = document.getElementById("theme_switch_input");
    modeSwitchInput.checked = _charcoalIsEnabled(mode);
    modeSwitchInput.addEventListener('change', (e) => {
        mode = _updateMode(e.target.checked);
    });

    listenForModeUpdates(function(newMode) {
        if (newMode == mode) {
            return;
        }

        mode = newMode;
        modeSwitchInput.checked = _charcoalIsEnabled(mode);
    });
});

function _updateMode(isEnabled) {
    var mode = isEnabled ? CHARCOAL_MODE : DEFAULT_MODE;
    updateStoredMode(mode, function() {});
    return mode;
}

function _charcoalIsEnabled(mode) {
    return mode == CHARCOAL_MODE;
}