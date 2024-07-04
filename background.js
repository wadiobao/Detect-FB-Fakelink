chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'URL_DATA') {
    // Truyền thông điệp đến content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'UNSHORTENED_URL', data: message.data });
    });
  }
});
