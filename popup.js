document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const statusDiv = document.getElementById('status');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const delayInput = document.getElementById('delay');
    const scrollDelayInput = document.getElementById('scrollDelay');
    const actionTypeSelect = document.getElementById('actionType');
    const nameFilterTextarea = document.getElementById('nameFilter');

    let isRunning = false;

    // Load saved settings
    chrome.storage.sync.get(['delay', 'scrollDelay', 'actionType', 'nameFilter'], function(result) {
        if (result.delay) delayInput.value = result.delay;
        if (result.scrollDelay) scrollDelayInput.value = result.scrollDelay;
        if (result.actionType) actionTypeSelect.value = result.actionType;
        if (result.nameFilter) nameFilterTextarea.value = result.nameFilter;
        
        // Update status message based on initial action type
        updateStatusMessage();
    });

    // Save settings when changed
    delayInput.addEventListener('change', function() {
        chrome.storage.sync.set({delay: delayInput.value});
    });

    scrollDelayInput.addEventListener('change', function() {
        chrome.storage.sync.set({scrollDelay: scrollDelayInput.value});
    });

    actionTypeSelect.addEventListener('change', function() {
        chrome.storage.sync.set({actionType: actionTypeSelect.value});
        updateStatusMessage();
    });

    nameFilterTextarea.addEventListener('change', function() {
        chrome.storage.sync.set({nameFilter: nameFilterTextarea.value});
    });

    startButton.addEventListener('click', async function() {
        if (isRunning) return;
        
        isRunning = true;
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        progressContainer.style.display = 'block';
        
        updateStatus('Starting process...', 'info');

        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            if (!tab.url.includes('meetup.com') || !tab.url.includes('/attendees')) {
                throw new Error('Please navigate to a Meetup event attendees page');
            }

            // First, try to inject the content script in case it's not loaded
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });
                // Wait a moment for the script to initialize
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (injectionError) {
                console.log('Content script may already be loaded:', injectionError);
            }

            // Determine source tab based on action type
            const actionType = actionTypeSelect.value;
            const sourceTab = getSourceTabFromActionType(actionType);

            // Send message to content script to start processing
            await chrome.tabs.sendMessage(tab.id, {
                action: 'start',
                delay: parseInt(delayInput.value),
                scrollDelay: parseInt(scrollDelayInput.value),
                meetupType: actionType,
                sourceTab: sourceTab,
                nameFilter: nameFilterTextarea.value.trim()
            });

        } catch (error) {
            console.error('Error starting process:', error);
            if (error.message.includes('Could not establish connection')) {
                updateStatus('Error: Content script not loaded. Try refreshing the page and reopening the extension.', 'error');
            } else {
                updateStatus(`Error: ${error.message}`, 'error');
            }
            resetUI();
        }
    });

    stopButton.addEventListener('click', async function() {
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            await chrome.tabs.sendMessage(tab.id, { action: 'stop' });
        } catch (error) {
            console.error('Error stopping process:', error);
            // Don't show error to user since stopping should always work
        }
        resetUI();
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.type === 'progress') {
            updateProgress(request.current, request.total);
            const progressMessage = request.skipped ? 
                `Processing: ${request.current} / ${request.total} (${request.skipped} skipped)` :
                `Processing: ${request.current} / ${request.total}`;
            updateStatus(progressMessage, 'info');
        } else if (request.type === 'completed') {
            let completedMessage = `Completed! Updated ${request.total} attendees`;
            if (request.skipped && request.skipped > 0) {
                completedMessage += ` (${request.skipped} skipped)`;
            }
            updateStatus(completedMessage, 'success');
            resetUI();
        } else if (request.type === 'error') {
            updateStatus(`Error: ${request.message}`, 'error');
            resetUI();
        } else if (request.type === 'status') {
            updateStatus(request.message, request.level || 'info');
        } else if (request.type === 'content_script_ready') {
            console.log('Content script is ready');
        }
    });

    function updateStatus(message, level) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${level}`;
    }

    function updateProgress(current, total) {
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${current} / ${total} updated`;
    }

    function resetUI() {
        isRunning = false;
        startButton.style.display = 'block';
        stopButton.style.display = 'none';
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0 / 0 updated';
    }

    function getSourceTabFromActionType(actionType) {
        // Determine which source tab to use based on the action type
        if (actionType === 'waitlist') {
            return 'going'; // Moving to waitlist means we're processing from going tab
        } else {
            return 'waitlist'; // Moving to going/went means we're processing from waitlist tab
        }
    }

    function updateStatusMessage() {
        const actionType = actionTypeSelect.value;
        const sourceTab = getSourceTabFromActionType(actionType);
        
        let statusMessage = '';
        if (actionType === 'waitlist') {
            statusMessage = 'Ready to move attendees from Going tab to Waitlist';
        } else if (actionType === 'past') {
            statusMessage = 'Ready to move attendees from Waitlist tab to "Went"';
        } else if (actionType === 'future') {
            statusMessage = 'Ready to move attendees from Waitlist tab to "Going"';
        }
        
        statusDiv.textContent = statusMessage;
        statusDiv.className = 'status info';
    }
});
