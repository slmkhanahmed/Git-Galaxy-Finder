import Mellowtel from "mellowtel";
let mellowtel;

(async () => {
    // Replace "<configuration_key>" with your actual Mellowtel configuration key.
    mellowtel = new Mellowtel("04b8d498");

    // Initialize the Mellowtel SDK for the content script.
    await mellowtel.initContentScript();
})();
