let MODE_KEY = "mode" // deprecated
let SETTINGS_KEY = "settings"

let DEFAULT_MODE = "default"
let CHARCOAL_MODE = "charcoal"
let MIDNIGHT_MODE = "midnight"

function getStoredSettings(callback) {
    chrome.storage.sync.get([SETTINGS_KEY, MODE_KEY], function(result) {
        let storedSettings = result[SETTINGS_KEY];
        let storedMode = result[MODE_KEY];

        // convert old deprecated stored mode into settings
        var settings;
        if (storedSettings != null) {
            settings = storedSettings;
        } else if (storedMode != null) {
            settings = _convertLegacyModeToSettings(storedMode);
        } else {
            settings = _convertLegacyModeToSettings(CHARCOAL_MODE);
        }

        callback(settings);
    });
}

function updateStoredSettings(settings, callback) {
    chrome.storage.sync.set({ [SETTINGS_KEY]: settings }, callback);
}

function listenForModeUpdates(handler) {
    chrome.storage.onChanged.addListener(function(changes) {
        let newSettings = changes[SETTINGS_KEY].newValue;
        if (newSettings != null) {
            handler(newSettings);
        }
    });
}

function themeClassName(mode) {
    if (mode == CHARCOAL_MODE) {
        return "charcoal_theme"
    } else if (mode == MIDNIGHT_MODE) {
        return "midnight_theme"
    }
}

function toggleIconURL(settings) {
    if (!settings.isEnabled) {
        return chrome.extension.getURL("assets/facebook-messenger.svg");
    } else if (settings.preferredTheme == CHARCOAL_MODE) {
        return chrome.extension.getURL("assets/charcoal-messenger.svg");
    } else if (settings.preferredTheme == MIDNIGHT_MODE) {
        return chrome.extension.getURL("assets/midnight-messenger.svg");
    }
}

function _convertLegacyModeToSettings(mode) {
    var settings = {};
    settings.preferredTheme = CHARCOAL_MODE;
    settings.isEnabled = mode != DEFAULT_MODE;
    return settings;
}
