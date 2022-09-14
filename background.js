const GitHubPullRequestUrlPattern = new RegExp('^(.*):\/\/(.*)github(.*)\/(.*)\/pull\/([0-9]+)(.*)$')

try {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && GitHubPullRequestUrlPattern.test(tab.url)) {
            chrome.scripting.executeScript({
                files: ['contentScript.js'],
                target: { tabId }
            })
        }
    })
} catch (e) {
    console.error(e)
}