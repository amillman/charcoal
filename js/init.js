getStoredSettings(function(storedSettings) {
    var settings = storedSettings;

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
        var settingsDropdown = document.getElementById("charcoal_settings");
        charcoalIcon.onclick = function() {
            if (settingsDropdown != null) { return; }

            // remove any onboarding dropdowns if user presses settings button
            let onboardingDropdowns = document.getElementsByClassName("charcoal_dropdown onboarding");
            for (var i=0, dropdown; dropdown = onboardingDropdowns[i]; i++) {
                dropdown.parentNode.removeChild(dropdown);
            }

            var xhr= new XMLHttpRequest();
            xhr.open('GET', chrome.extension.getURL('settings.html'), true);
            xhr.onreadystatechange= function() {
                if (this.readyState!==4) return;
                if (this.status!==200) return; // or whatever error handling you want
                charcoalIcon.insertAdjacentHTML("afterend", `
                    <div class="charcoal_dropdown offset" id="charcoal_settings">
                        <div class="dropdown_container in_messenger_dropdown_container">
                            ${this.responseText}
                            <div class="button" id="charcoal_settings_done_button">Done</div>
                        </div>
                    </div>
                `);

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


function _showNewThemesOnboardingIfNeeded() {
    checkIfOnboardingNeeded(NEW_THEMES_ONBOARDING_KEY, function(showOnboarding) {
        if (!showOnboarding) { return; }

        let charcoalIcon = document.getElementsByClassName("charcoal_toggle")[0];

        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('onboarding_dropdown.html'), true);
        xhr.onreadystatechange= function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return; // or whatever error handling you want

            charcoalIcon.insertAdjacentHTML("afterend", this.response);

            let onboardingDropdown = document.getElementsByClassName("charcoal_dropdown onboarding")[0];

            // dismiss via close button
            document.getElementById("charcoal_onboarding_close_button").onclick = function() {
                onboardingDropdown.parentNode.removeChild(onboardingDropdown);
            }
        };
        xhr.send();
    });
}

