let MODE_KEY = "mode"

let DEFAULT_MODE = "default"
let CHARCOAL_MODE = "charcoal"

chrome.storage.sync.get(MODE_KEY, function(result) {
    // Initial theme when users first install.
    var mode = CHARCOAL_MODE;
    if (result[MODE_KEY] != null) {
        mode = result[MODE_KEY];
    }

    console.log(`Loading initial theme ${mode}`);
    document.documentElement.classList.add(themeClassName(mode));

    let css = chrome.extension.getURL("themes.css");
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.id = "charcoal-messenger";
    link.href = css;
    document.head.appendChild(link);

    window.onload = function() {
        let settingsIcon = document.getElementsByClassName("_4kzu")[0];
        settingsIcon.insertAdjacentHTML("afterend", `
            <div class="charcoal_toggle" style="background-image:url('${toggleIconURL(mode)}')""></div>
        `);

        let themeIcon = document.getElementsByClassName("charcoal_toggle")[0];
        themeIcon.onclick = function() {
            let oldMode = mode;
            mode = toggledMode(mode);
            console.log(`Switching theme from ${oldMode} to ${mode}`);

            chrome.storage.sync.set({ [MODE_KEY]: mode }, function() {
                document.documentElement.classList.remove(themeClassName(oldMode));
                document.documentElement.classList.add(themeClassName(mode));
                themeIcon.setAttribute("style", `background-image:url('${toggleIconURL(mode)}')`);
            });
        }
    }
})

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


