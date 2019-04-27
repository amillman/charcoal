let css = chrome.extension.getURL("stylesheet.css");
let link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.id = "charcoal-messenger";
link.href = css;
document.head.appendChild(link);

getStoredMode(function(storedMode) {
    var mode = storedMode;

    console.log(`Loading initial theme ${mode}`);
    document.documentElement.classList.add(themeClassName(mode));

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

            console.log(`Switching theme to ${mode}`);
            updateStoredMode(mode, function() {
                updateUIWithMode(mode, oldMode);
            });
        }

        listenForModeUpdates(function(newMode) {
            if (newMode == mode) {
                return;
            }

            console.log(`Switching theme to ${mode} from external update`);

            updateUIWithMode(newMode, mode);
            mode = newMode;
        });

        function updateUIWithMode(mode, oldMode) {
            document.documentElement.classList.remove(themeClassName(oldMode));
            document.documentElement.classList.add(themeClassName(mode));
            themeIcon.setAttribute("style", `background-image:url('${toggleIconURL(mode)}')`);
        }
    }
})


