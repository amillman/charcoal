var settings;
var settingsDropdown;

getStoredSettings(function(storedSettings) {
    settings = storedSettings;

    console.log(`Loading initial settings enabled=${settings.isEnabled}, preferredTheme=${settings.preferredTheme}`);

    // initial theme
    if (settings.isEnabled) {
        document.documentElement.classList.add(themeClassName(settings.preferredTheme));
    }

    window.onload = function() {
        // add settings button
        let settingsIcon = document.getElementsByClassName("_4kzu")[0];
        settingsIcon.insertAdjacentHTML("afterend", `
            <div class="charcoal_toggle_wrapper">
                <div class="charcoal_toggle" style="background-image:url('${settingsIconURL(settings)}')""></div>
            </div>
        `);

        // show settings on click
        let charcoalIcon = document.getElementsByClassName("charcoal_toggle")[0];
        charcoalIcon.onclick = _openSettings;

        // allow tapping outside settings dropdown to dismiss it
        window.onclick = function(e) {
            if (settingsDropdown == null) { return; }

            // don't dismiss if click happened inside settings dropdown
            var target = e.target;
            do {
                if (target == settingsDropdown) { return; }
                target = target.parentNode;
            } while (target);

            settingsDropdown.parentNode.removeChild(settingsDropdown);
            settingsDropdown = null;
        }

        // listen for external updates (settings dropdown, popup)
        listenForSettingsUpdates(function(newSettings) {
            if (newSettings == settings) {
                return;
            }

            console.log(`External update settings: enabled=${newSettings.isEnabled}, preferredTheme=${newSettings.preferredTheme}`);

            settings = newSettings;
            document.documentElement.classList.remove(themeClassName(CHARCOAL_MODE), themeClassName(MIDNIGHT_MODE));
            if (settings.isEnabled) {
                document.documentElement.classList.add(themeClassName(settings.preferredTheme));
            }

            charcoalIcon.setAttribute("style", `background-image:url('${settingsIconURL(settings)}')`);
        });

        _showNewThemesOnboardingIfNeeded();
    }
})

function _getCharcoalIcon() {
    return document.getElementsByClassName("charcoal_toggle")[0];
}

function _showNewThemesOnboardingIfNeeded() {
    checkIfOnboardingNeeded(NEW_THEMES_ONBOARDING_KEY, function(showOnboarding) {
        if (!showOnboarding) { return; }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('onboarding_dropdown.html'), true);
        xhr.onreadystatechange= function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return; // or whatever error handling you want

            _getCharcoalIcon().insertAdjacentHTML("afterend", this.response);

            let onboardingDropdown = document.getElementsByClassName("charcoal_dropdown onboarding")[0];

            // dismiss via close button
            document.getElementById("charcoal_onboarding_go_button").onclick = function() {
                _openSettings();
            }

            // dismiss via close button
            document.getElementById("charcoal_onboarding_close_button").onclick = function() {
                onboardingDropdown.parentNode.removeChild(onboardingDropdown);
            }
        };
        xhr.send();
    });
}

function _openSettings() {
    if (settingsDropdown != null) { return; }

    // remove any onboarding dropdowns after the first
    let onboardingDropdowns = document.getElementsByClassName("charcoal_dropdown onboarding");
    for (var i=1, dropdown; dropdown = onboardingDropdowns[i]; i++) {
        dropdown.parentNode.removeChild(dropdown);
    }

    var xhr= new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('settings.html'), true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want

        let dropdownInnerHTML = `
            <div class="dropdown_container in_messenger_dropdown_container">
                <div class="content_container">
                    ${this.responseText}
                    <div class="button" id="charcoal_settings_done_button">Done</div>
                </div>
            </div>
        `;

        var currentDropdown = document.getElementsByClassName("charcoal_dropdown")[0];
        if (currentDropdown) {
            let oldHeightContainer = document.getElementsByClassName("content_container")[0];
            currentDropdown.style.height = `${oldHeightContainer.clientHeight}px`;

            currentDropdown.setAttribute("id", "charcoal_settings");
            currentDropdown.innerHTML = dropdownInnerHTML;

            let newHeightContainer = document.getElementsByClassName("content_container")[0];
            currentDropdown.style.height = `${newHeightContainer.clientHeight}px`;
        } else {
            _getCharcoalIcon().insertAdjacentHTML("afterend", `
                <div class="charcoal_dropdown offset" id="charcoal_settings">
                    ${dropdownInnerHTML}
                </div>
            `);

            currentDropdown = document.getElementsByClassName("charcoal_dropdown")[0];
            currentDropdown.style.height = `0px`;

            let heightContainer = document.getElementsByClassName("content_container")[0];
            currentDropdown.style.height = `${heightContainer.clientHeight}px`;
        }

        settingsDropdown = document.getElementById("charcoal_settings");

        // dismiss via done button
        document.getElementById("charcoal_settings_done_button").onclick = function() {
            settingsDropdown.parentNode.removeChild(settingsDropdown);
            settingsDropdown = null;
        }

        runSettings();
    };
    xhr.send();
}
