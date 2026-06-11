// Service worker — handles extension icon badge and messaging.

const JOB_SITE_PATTERNS = [
  /linkedin\.com\/jobs/,
  /indeed\.com\/(viewjob|job)/,
  /glassdoor\.com\/job-listing/,
  /lever\.co/,
  /greenhouse\.io\/jobs/,
  /myworkdayjobs\.com/,
  /ashbyhq\.com/,
  /smartrecruiters\.com/,
]

function isJobSite(url) {
  return JOB_SITE_PATTERNS.some((p) => p.test(url))
}

// Update badge when active tab changes
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId).catch(() => null)
  if (tab?.url && isJobSite(tab.url)) {
    chrome.action.setBadgeText({ text: '↑', tabId })
    chrome.action.setBadgeBackgroundColor({ color: '#3b82f6', tabId })
  } else {
    chrome.action.setBadgeText({ text: '', tabId })
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return
  if (tab.url && isJobSite(tab.url)) {
    chrome.action.setBadgeText({ text: '↑', tabId })
    chrome.action.setBadgeBackgroundColor({ color: '#3b82f6', tabId })
  } else {
    chrome.action.setBadgeText({ text: '', tabId })
  }
})
