if (typeof init === 'undefined') {
    const CtrlShortcutLetter = 'b'

    const TimelineItemClass = "TimelineItem"
    const LabelClass = "Label"
    const BotLabelText = "bot"
    const AreBotCommentsVisibleKey = 'areBotCommentsVisible+'

    const setBotCommentVisibility = (visible) => {
        const xpath = `//span[contains(@class, '${LabelClass}') and text()='${BotLabelText}']`
        var matchingElements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        requestIdleCallback(() => {
            for (let i = 0; i < matchingElements.snapshotLength; i++) {
                const $commentContainer = matchingElements.snapshotItem(i).closest(`.${TimelineItemClass}`)
                $commentContainer.style.display = visible ? null : 'none'
            }
        })
    }

    const toggleBotCommentVisibility = () => {
        chrome.storage.sync.get([AreBotCommentsVisibleKey], (result) => {
            const areBotCommentsVisible = result[AreBotCommentsVisibleKey]
            setBotCommentVisibility(!areBotCommentsVisible)
            chrome.storage.sync.set({[AreBotCommentsVisibleKey]: !areBotCommentsVisible})
        })
    }

    const init = () => {
        chrome.storage.sync.get([AreBotCommentsVisibleKey], (result) => {
            let shouldBeVisible = result[AreBotCommentsVisibleKey]
            if (shouldBeVisible == null) {
                shouldBeVisible = false
                chrome.storage.sync.set({[AreBotCommentsVisibleKey]: shouldBeVisible})
            }
            setBotCommentVisibility(shouldBeVisible)
        })
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && String.fromCharCode(e.keyCode).toLowerCase() === CtrlShortcutLetter.toLowerCase()) {
                e.preventDefault()
                e.stopPropagation()
                toggleBotCommentVisibility()
            }
        });
    }

    requestIdleCallback(init)
}