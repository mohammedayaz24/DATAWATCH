
const monitorBtn = document.getElementById("monitorBtn");
const totalUsage = document.getElementById("totalUsage");
const hourUsage = document.getElementById("hourUsage");

function formatBytes(bytes) {
    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function updateUI() {
    const result = await chrome.runtime.sendMessage({
        action: "GET_STATUS"
    });

    monitorBtn.textContent = result.monitoring
        ? "Stop Monitoring"
        : "Start Monitoring";

    totalUsage.textContent = formatBytes(result.totalBytes || 0);
    hourUsage.textContent = formatBytes(result.lastHourBytes || 0);
}

monitorBtn.addEventListener("click", async () => {
    const action = monitorBtn.textContent === "Start Monitoring"
        ? "START"
        : "STOP";

    await chrome.runtime.sendMessage({ action });

    await updateUI();
});

updateUI();
