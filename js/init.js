let css = chrome.extension.getURL("stylesheet.css");
let link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.id = "charcoal-messenger";
link.href = css;
document.head.appendChild(link);

getStoredSettings(function(storedSettings) {
    var settings = storedSettings;

    console.log(`Loading initial settings enabled=${settings.isEnabled}, preferredTheme=${settings.preferredTheme}`);

    if (settings.isEnabled) {
        document.documentElement.classList.add(themeClassName(settings.preferredTheme));
    }

    window.onload = function() {
        let settingsIcon = document.getElementsByClassName("_4kzu")[0];
        settingsIcon.insertAdjacentHTML("afterend", `
            <div class="charcoal_toggle_wrapper">
                <div class="charcoal_toggle" style="background-image:url('${settingsIconURL(settings)}')""></div>
            </div>
        `);

        let themeIcon = document.getElementsByClassName("charcoal_toggle")[0];
        themeIcon.onclick = function() {
            // let oldMode = mode;
            // mode = toggledMode(mode);

            // console.log(`Switching theme to ${mode}`);
            // updateStoredMode(mode, function() {
            //     updateUIWithMode(mode, oldMode);
            // });
        }

        listenForSettingsUpdates(function(newSettings) {
            if (newSettings == settings) {
                return;
            }

            console.log(`External update settings...
                enabled=${newSettings.isEnabled}, preferredTheme=${newSettings.preferredTheme}`);

            settings = newSettings;
            updateUI();

        });

        function updateUI() {
            document.documentElement.classList.remove(themeClassName(CHARCOAL_MODE), themeClassName(MIDNIGHT_MODE));
            if (settings.isEnabled) {
                document.documentElement.classList.add(themeClassName(settings.preferredTheme));
            }

            themeIcon.setAttribute("style", `background-image:url('${settingsIconURL(settings)}')`);
        }
    }
})


