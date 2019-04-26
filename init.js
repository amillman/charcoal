let css = chrome.extension.getURL("themes.css");
let link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.id = "charcoal-messenger";
link.href = css;
document.head.appendChild(link);

let defaultLogoURL = chrome.extension.getURL("facebook-messenger.svg");
let charcoalURL = chrome.extension.getURL("charcoal-messenger.svg");

window.onload = function() {
    let settingsIcon = document.getElementsByClassName("_4kzu")[0];
    settingsIcon.insertAdjacentHTML("afterend", `
        <div class="charcoal_toggle" style="background-image:url('${charcoalURL}'""></div>
    `);
}
