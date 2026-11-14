
const seenResources = new Set();

function reportResource(resource) {
    if (!resource.transferSize) return;

    const key = [
        resource.name,
        resource.startTime,
        resource.duration,
        resource.transferSize
    ].join("|");

    if (seenResources.has(key)) return;

    seenResources.add(key);

    chrome.runtime.sendMessage({
        action: "RESOURCE_USAGE",
        bytes: resource.transferSize
    }).catch(() => { });
}

// Capture resources already present when the script loads.
performance.getEntriesByType("resource").forEach(reportResource);

// Capture newly loaded resources, including video chunks.
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(reportResource);
});

observer.observe({ type: "resource", buffered: true });
