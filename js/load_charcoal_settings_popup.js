var xhr= new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL('charcoal_settings.html'), true);
xhr.onreadystatechange= function() {
    if (this.readyState!==4) return;
    if (this.status!==200) return;
    document.getElementsByClassName("content_container")[0].insertAdjacentHTML("afterbegin", this.responseText);

    setupCharcoalSettings();
    // done button
    document.getElementById("charcoal_settings_done_button").onclick = function() {
        window.close();
    }
};
xhr.send();