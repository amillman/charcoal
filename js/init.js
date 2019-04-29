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
        let themeIcon = document.getElementsByClassName("charcoal_toggle")[0];
        var settingsDropdown = document.getElementById("charcoal_settings");
        themeIcon.onclick = function() {
            if (settingsDropdown != null) { return; }
            var xhr= new XMLHttpRequest();
            xhr.open('GET', chrome.extension.getURL('settings.html'), true);
            xhr.onreadystatechange= function() {
                if (this.readyState!==4) return;
                if (this.status!==200) return; // or whatever error handling you want
                themeIcon.insertAdjacentHTML("afterend", `
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

            themeIcon.setAttribute("style", `background-image:url('${settingsIconURL(settings)}')`);
        });

        _showNewThemesOnboardingIfNeeded();
    }
})


function _showNewThemesOnboardingIfNeeded() {
    checkIfOnboardingNeeded(NEW_THEMES_ONBOARDING_KEY, function(showOnboarding) {
        if (!showOnboarding) { return; }

        let themeIcon = document.getElementsByClassName("charcoal_toggle")[0];

        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('onboarding_dropdown.html'), true);
        xhr.onreadystatechange= function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return; // or whatever error handling you want

            themeIcon.insertAdjacentHTML("afterend", this.response);

            // settingsDropdown = document.getElementById("charcoal_settings");

            // // dismiss via done button
            // document.getElementById("charcoal_settings_done_button").onclick = function() {
            //     settingsDropdown.parentNode.removeChild(settingsDropdown);
            //     settingsDropdown = null;
            // }

            // runSettings();
        };
        xhr.send();
    });
}

