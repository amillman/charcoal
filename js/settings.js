let SETTINGS_KEY = "settings"

let DEFAULT_MODE = "default"
let CHARCOAL_MODE = "charcoal"
let MIDNIGHT_MODE = "midnight"
let DEEPBLUE_MODE = "deepblue"

let LIGHT_APPEARANCE = "light"
let DARK_APPEARANCE = "dark"
let SYSTEM_APPEARANCE = "system"

// onboarding / education
let NEW_THEMES_ONBOARDING_KEY = "NEW_THEMES_ONBOARDING_KEY"
let APPEARANCE_ONBOARDING_KEY = "APPEARANCE_ONBOARDING_KEY"

function getStoredSettings(callback) {
    chrome.storage.sync.get([SETTINGS_KEY], function(result) {
        let settings = result[SETTINGS_KEY] ?? _defaultSettings();
        // replace legacy "isEnabled" setting with "appearance"
        _insertAppearanceIfNeeded(settings);
        _loadMethods(settings);

        callback(settings);
    });
}

function updateStoredSettings(settings, callback) {
    chrome.storage.sync.set({ [SETTINGS_KEY]: settings }, callback);
}

function listenForSettingsUpdates(handler) {
    chrome.storage.onChanged.addListener(function(changes) {
        let settingsChanges = changes[SETTINGS_KEY];
        if (settingsChanges && settingsChanges.newValue) {
            let newSettings = settingsChanges.newValue;
            _loadMethods(newSettings);
            handler(newSettings);
        }
    });
}

function listenForSystemThemeUpdates(handler) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        handler();
    });
}

function checkIfOnboardingNeeded(key, handler) {
    chrome.storage.sync.get(key, function(result) {
        let hasSeenOnboarding = result[key];
        handler(hasSeenOnboarding == null || !hasSeenOnboarding);
    });
}

function updateOnboardingSeen(key) {
    chrome.storage.sync.set({ [key]: true });
}

function themeClassName(theme) {
    if (theme == CHARCOAL_MODE) {
        return "charcoal_theme"
    } else if (theme == MIDNIGHT_MODE) {
        return "midnight_theme"
    } else if (theme == DEEPBLUE_MODE) {
        return "deepblue_theme"
    } else {
        return ""
    }
}

function themeIconURL(theme) {
    if (theme == CHARCOAL_MODE) {
        return chrome.extension.getURL("assets/charcoal-messenger.svg");
    } else if (theme == MIDNIGHT_MODE) {
        return chrome.extension.getURL("assets/midnight-messenger.svg");
    } else if (theme == DEEPBLUE_MODE) {
        return chrome.extension.getURL("assets/deepblue-messenger.svg");
    } else {
        return chrome.extension.getURL("assets/facebook-messenger.svg");
    }
}

function _insertAppearanceIfNeeded(settings) {
    if (settings.isEnabled != null) {
        if (settings.isEnabled) {
            settings.appearance = DARK_APPEARANCE;
        } else {
            settings.appearance = LIGHT_APPEARANCE;
        }
        delete settings.isEnabled;
    }
}

function _loadMethods(settings) {
    settings.currentTheme = function() {
        // return Charcoal for popup since it does not change theme
        if (document.documentElement.id == 'settings_popup') {
            return CHARCOAL_MODE;
        }

        switch(settings.appearance) {
        case LIGHT_APPEARANCE:
            return DEFAULT_MODE;
        case DARK_APPEARANCE:
            return settings.preferredTheme;
        case SYSTEM_APPEARANCE:
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? settings.preferredTheme : DEFAULT_MODE;
        default:
            return CHARCOAL_MODE;
        }
    }
}

function _defaultSettings() {
    var settings = {};
    settings.appearance = DARK_APPEARANCE;
    settings.preferredTheme = CHARCOAL_MODE;
    return settings;
}
