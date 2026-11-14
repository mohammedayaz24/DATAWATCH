
let monitoring = false;
let totalBytes = 0;
let lastHourBytes = 0;

chrome.storage.local.get(
    ["monitoring", "totalBytes", "lastHourBytes"],
    (data) => {
        monitoring = data.monitoring ?? false;
        totalBytes = data.totalBytes ?? 0;
        lastHourBytes = data.lastHourBytes ?? 0;
    }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "START") {
        monitoring = true;
        totalBytes = 0;
        lastHourBytes = 0;

        chrome.storage.local.set({
            monitoring,
            totalBytes,
            lastHourBytes
        });

        sendResponse({ status: "started" });
    }

    if (message.action === "STOP") {
        monitoring = false;

        chrome.storage.local.set({ monitoring });

        sendResponse({ status: "stopped" });
    }

    if (message.action === "GET_STATUS") {
        sendResponse({
            monitoring,
            totalBytes,
            lastHourBytes
        });
    }

    if (message.action === "RESOURCE_USAGE" && monitoring) {
        totalBytes += message.bytes;

        lastHourBytes += message.bytes;

        chrome.storage.local.set({
            totalBytes,
            lastHourBytes
        });
    }

    return true;
});
