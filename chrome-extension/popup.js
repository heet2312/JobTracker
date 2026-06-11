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

function el(id) {
  return document.getElementById(id)
}

async function getStoredAppUrl() {
  return new Promise((resolve) => {
    chrome.storage.local.get('appUrl', (result) => {
      resolve(result.appUrl || 'https://aijobtracker.app')
    })
  })
}

async function setStoredAppUrl(url) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ appUrl: url }, resolve)
  })
}

async function main() {
  const appUrl = await getStoredAppUrl()
  el('appUrlInput').value = appUrl

  // Persist changes to app URL
  el('appUrlInput').addEventListener('change', async (e) => {
    const raw = e.target.value.trim().replace(/\/$/, '')
    if (raw) await setStoredAppUrl(raw)
  })

  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const currentUrl = tab?.url || ''
  const currentTitle = tab?.title || 'Job posting'

  function openImportPage(url) {
    const importUrl = `${appUrl}/import?url=${encodeURIComponent(url)}`
    chrome.tabs.create({ url: importUrl })

    el('successBanner').style.display = 'flex'
    el('importBtn').disabled = true
    setTimeout(() => window.close(), 1200)
  }

  function openApp() {
    chrome.tabs.create({ url: appUrl })
    window.close()
  }

  if (isJobSite(currentUrl)) {
    el('jobDetected').style.display = 'block'

    // Truncate long titles
    const titleShort = currentTitle.length > 60
      ? currentTitle.slice(0, 57) + '…'
      : currentTitle
    el('pageTitle').textContent = titleShort

    // Show a clean version of the URL
    try {
      const u = new URL(currentUrl)
      el('pageUrl').textContent = u.hostname + u.pathname.slice(0, 40)
    } catch {
      el('pageUrl').textContent = currentUrl.slice(0, 60)
    }

    el('importBtn').addEventListener('click', () => openImportPage(currentUrl))
    el('openAppBtn').addEventListener('click', openApp)
  } else {
    el('notJobPage').style.display = 'block'
    el('openAppBtn2').addEventListener('click', openApp)
  }
}

main().catch(console.error)
