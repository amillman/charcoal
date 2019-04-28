// let css = chrome.extension.getURL("../styles/stylesheet.css");
// let link = document.createElement('link');
// link.type = 'text/css';
// link.rel = 'stylesheet';
// link.id = "charcoal-messenger";
// link.href = css;
// document.head.appendChild(link);

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
        var settingsDropdown = document.getElementsByClassName("charcoal_settings")[0];
        themeIcon.onclick = function() {
            console.log(settingsDropdown);
            if (settingsDropdown != null) { return;
            }
            var xhr= new XMLHttpRequest();
            xhr.open('GET', chrome.extension.getURL('settings.html'), true);
            xhr.onreadystatechange= function() {
                if (this.readyState!==4) return;
                if (this.status!==200) return; // or whatever error handling you want
                themeIcon.insertAdjacentHTML("afterend", `
                    <div class="charcoal_settings offset">
                        <div id="in_messenger_dropdown_container">
                            ${this.responseText}
                            <div class="button" id="charcoal_settings_done_button">Done</div>
                        </div>
                    </div>
                `);

                settingsDropdown = document.getElementsByClassName("charcoal_settings")[0];

                document.getElementById("charcoal_settings_done_button").onclick = function() {
                    settingsDropdown.parentNode.removeChild(settingsDropdown);
                    settingsDropdown = null;
                }

                runSettings();
            };
            xhr.send();
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


