let MODE_KEY = "mode"

let DEFAULT_MODE = "default"
let CHARCOAL_MODE = "charcoal"

function getStoredMode(callback) {
    chrome.storage.sync.get(MODE_KEY, function(result) {
        let storedMode = result[MODE_KEY];
        var mode = CHARCOAL_MODE;
        if (storedMode != null) {
            mode = storedMode;
        }

        callback(mode);
    });
}

function updateStoredMode(mode, callback) {
    chrome.storage.sync.set({ [MODE_KEY]: mode }, callback);
}

function listenForModeUpdates(handler) {
    chrome.storage.onChanged.addListener(function(changes) {
        let newMode = changes[MODE_KEY].newValue;
        if (newMode != null) {
            handler(newMode);
        }
    });
}

function themeClassName(mode) {
    if (mode == DEFAULT_MODE) {
        return "default_theme";
    } else if (mode == CHARCOAL_MODE) {
        return "charcoal_theme"
    }
}

function toggleIconURL(mode) {
    if (mode == DEFAULT_MODE) {
        return chrome.extension.getURL("facebook-messenger.svg");
    } else if (mode == CHARCOAL_MODE) {
        return chrome.extension.getURL("charcoal-messenger.svg");
    }
}

function toggledMode(mode) {
    return mode == DEFAULT_MODE ? CHARCOAL_MODE : DEFAULT_MODE;
}
