let css = chrome.extension.getURL("night.css");
let link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.id = "messenger-night";
link.href = css;
document.head.appendChild(link);

//._4kzu on click get .uiContextualLayerBelowLeft -> ._54ng ._54nf (dropdown)
console.log("ASS");

window.onload = function() {
    let settingsIcon = document.getElementsByClassName("_4kzu")[0];
    settingsIcon.onclick = function() {
        let settingsDropdown = document
            .getElementsByClassName("uiContextualLayerBelowLeft")[0]
            .getElementsByClassName("_54ng")[0]
            .getElementsByClassName("_54nf")[0];

        if (settingsDropdown.getElementsByClassName("charcoal_toggle")[0] !== undefined) {
            return;
        }

        let settingsRow = settingsDropdown.getElementsByClassName("_54ni")[0];
        settingsRow.insertAdjacentHTML("afterend", `
            <li class="_54ni __MenuItem charcoal_toggle" role="presentation">
                <a class="_54nc" href="#" role="menuitem">
                    <span><span class="_54nh">Charcoal</span></span>
                </a>
            </li>
        `);

    }
}
