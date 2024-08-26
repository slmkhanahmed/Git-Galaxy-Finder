import Mellowtel from "mellowtel";
let mellowtel;

(async () => {
    mellowtel = new Mellowtel("04b8d498");

    await mellowtel.initBackground();
})();

chrome.runtime.onInstalled.addListener(async function (details) {
    console.log("Extension Installed or Updated");

    await mellowtel.generateAndOpenOptInLink();
});
