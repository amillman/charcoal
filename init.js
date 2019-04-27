chrome.storage.sync.get(MODE_KEY, function(result) {
    // Initial theme when users first install.
    var mode = CHARCOAL_MODE;
    if (result[MODE_KEY] != null) {
        mode = result[MODE_KEY];
    }

    console.log(`Loading initial theme ${mode}`);
    document.documentElement.classList.add(themeClassName(mode));

    let css = chrome.extension.getURL("stylesheet.css");
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.id = "charcoal-messenger";
    link.href = css;
    document.head.appendChild(link);

    window.onload = function() {
        let settingsIcon = document.getElementsByClassName("_4kzu")[0];
        settingsIcon.insertAdjacentHTML("afterend", `
            <div class="charcoal_toggle_wrapper">
                <div class="charcoal_toggle" style="background-image:url('${toggleIconURL(mode)}')""></div>
            </div>
        `);

        let themeIcon = document.getElementsByClassName("charcoal_toggle")[0];
        themeIcon.onclick = function() {
            let oldMode = mode;
            mode = toggledMode(mode);

            updateMode(mode, oldMode, function() {
                document.documentElement.classList.remove(themeClassName(oldMode));
                document.documentElement.classList.add(themeClassName(mode));
                themeIcon.setAttribute("style", `background-image:url('${toggleIconURL(mode)}')`);
            });
        }
    }
})
