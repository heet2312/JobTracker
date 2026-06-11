// Content script — runs on supported job sites.
// Sends the current page URL back to the popup when requested.

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_PAGE_INFO') {
    sendResponse({
      url: window.location.href,
      title: document.title,
    })
  }
})
