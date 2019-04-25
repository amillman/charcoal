let css = chrome.extension.getURL("night.css");
console.log(css);
let link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.id = "messenger-night";
link.href = css;
document.head.appendChild(link);