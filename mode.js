let MODE_KEY = "mode"

let DEFAULT_MODE = "default"
let CHARCOAL_MODE = "charcoal"

function updateMode(mode, oldMode, callback) {
    console.log(`Switching theme from ${oldMode} to ${mode}`);
    chrome.storage.sync.set({ [MODE_KEY]: mode }, callback);
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
