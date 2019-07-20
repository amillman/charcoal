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
        let settingsIcon = document.getElementsByClassName("_7sta _7stb _87u_")[0];
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
            if (!_settingsIsOpen()) { return; }

            let currentDropDown = _getCurrentDropdown();

            // don't dismiss if click happened inside settings dropdown
            var target = e.target;
            do {
                if (target == currentDropDown) { return; }
                target = target.parentNode;
            } while (target);

            _transitionDropdown(null);
        }

        // listen for external updates (settings dropdown, popup)
        listenForSettingsUpdates(function(newSettings) {
            if (newSettings == settings) {
                return;
            }

            console.log(`External update settings: enabled=${newSettings.isEnabled}, preferredTheme=${newSettings.preferredTheme}`);

            settings = newSettings;
            document.documentElement.classList.remove(themeClassName(CHARCOAL_MODE), themeClassName(MIDNIGHT_MODE), themeClassName(DEEPBLUE_MODE));
            if (settings.isEnabled) {
                document.documentElement.classList.add(themeClassName(settings.preferredTheme));
            }

            charcoalIcon.setAttribute("style", `background-image:url('${settingsIconURL(settings)}')`);
        });

        setTimeout(_showNewThemesOnboardingIfNeeded, 1000);
    }
})

function _getCharcoalIcon() {
    return document.getElementsByClassName("charcoal_toggle")[0];
}

function _getCurrentDropdown() {
    return document.getElementsByClassName("charcoal_dropdown")[0];
}

function _settingsIsOpen() {
    return document.getElementById("charcoal_settings") != null;
}

function _showNewThemesOnboardingIfNeeded() {
    checkIfOnboardingNeeded(NEW_THEMES_ONBOARDING_KEY, function(showOnboarding) {
        if (!showOnboarding) { return; }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('onboarding_dropdown.html'), true);
        xhr.onreadystatechange= function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return; // or whatever error handling you want

            _transitionDropdown(this.responseText, function() {
                document.getElementsByClassName("version_tag")[0].textContent = `v${chrome.runtime.getManifest().version}`;
                // dismiss via close button
                document.getElementById("charcoal_onboarding_go_button").onclick = _openSettings;

                // dismiss via close button
                document.getElementById("charcoal_onboarding_close_button").onclick = function() {
                    _transitionDropdown(null);
                }
            });

            updateOnboardingSeen(NEW_THEMES_ONBOARDING_KEY);
        };
        xhr.send();
    });
}

function _openSettings() {
    if (_settingsIsOpen()) { return; }

    var xhr= new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('settings.html'), true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want

        let dropdownInnerHTML = `
            ${this.responseText}
            <div class="button" id="charcoal_settings_done_button">Done</div>
        `;

        _transitionDropdown(dropdownInnerHTML, function() {
            let currentDropDown = _getCurrentDropdown();
            currentDropDown.setAttribute("id", "charcoal_settings");

            // dismiss via done button
            document.getElementById("charcoal_settings_done_button").onclick = function() {
                if (!_settingsIsOpen) { return; }
                _transitionDropdown(null);
            }

            runSettings();
        });
    };
    xhr.send();
}

let animationTime = 300;
// transitions the dropdown to newContent.
// if newContent is nil, animate the height to 0.
// if the current dropdown does not exist, animate from height 0.
// if it does, animate the height from the old content to new content.
function _transitionDropdown(newContent, callback = function() {}) {
    if (newContent == null) {
        let currentDropDown = _getCurrentDropdown();
        if (currentDropDown) {
            currentDropDown.style.height = `0px`;
            setTimeout(function() {
                currentDropDown.parentNode.removeChild(currentDropDown);
                callback();
            }, 300);
        }
        return;
    }

    // remove any dropdowns after the first
    let onboardingDropdowns = document.getElementsByClassName("charcoal_dropdown");
    for (var i=1, dropdown; dropdown = onboardingDropdowns[i]; i++) {
        dropdown.parentNode.removeChild(dropdown);
    }

    if (_getCurrentDropdown()) {
        _getCurrentDropdown().removeAttribute("id");
        _getCurrentDropdown().style.height = `0px`;

        // after the 0 height animation is done, add new content and reanimate open
        setTimeout(function() {
            _getCurrentDropdown().getElementsByClassName("content_container")[0].innerHTML = newContent;
            let contentContainer = document.getElementsByClassName("content_container")[0];
            _getCurrentDropdown().style.height = `${contentContainer.clientHeight}px`;
            callback();
        }, animationTime + 200);
    } else {
        _getCharcoalIcon().insertAdjacentHTML("afterend", `
            <div class="charcoal_dropdown offset">
                <div class="dropdown_container in_messenger_dropdown_container">
                    <div class="content_container">
                        ${newContent}
                    </div>
                </div>
            </div>
        `);

        _getCurrentDropdown().style.height = `0px`;

        let contentContainer = document.getElementsByClassName("content_container")[0];
        _getCurrentDropdown().style.height = `${contentContainer.clientHeight}px`;
        callback();
    }
}
