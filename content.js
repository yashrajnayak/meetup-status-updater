// Content script for Meetup Status Updater
console.log('Meetup Status Updater content script loaded');

// Signal that content script is ready
if (typeof chrome !== 'undefined' && chrome.runtime) {
    setTimeout(() => {
        try {
            chrome.runtime.sendMessage({type: 'content_script_ready'}).catch(() => {
                console.log('Could not notify popup that content script is ready');
            });
        } catch (error) {
            console.log('Content script ready notification failed:', error);
        }
    }, 1000);
}

// Enhanced attendee processor with better selectors based on the provided HTML
class MeetupAttendeeProcessor {
    constructor() {
        this.isRunning = false;
        this.delay = 2000;
        this.scrollDelay = 3000;
        this.processedCount = 0;
        this.totalCount = 0;
        this.currentDropdown = null;
        this.meetupType = 'past'; // 'past' or 'future'
        this.nameFilter = []; // Array of names to filter by
        this.skippedCount = 0; // Count of attendees skipped due to name filter
        this.processedAttendeeIds = new Set(); // Track processed attendee elements to avoid duplicates
        this.hasTabSwitched = false; // Track if tab has switched
    }

    async processAllAttendees(delay = 2000, scrollDelay = 3000, meetupType = 'past', nameFilter = '') {
        this.delay = delay;
        this.scrollDelay = scrollDelay;
        this.meetupType = meetupType;
        this.nameFilter = nameFilter ? nameFilter.split('\n').map(name => name.trim()).filter(name => name.length > 0) : [];
        this.isRunning = true;
        this.processedCount = 0;
        this.skippedCount = 0;
        this.processedAttendeeIds.clear(); // Reset tracking for new run
        this.hasTabSwitched = false; // Reset tab switch tracking

        try {
            this.sendMessage('status', 'Initializing...', 'info');
            
            // Wait for page to load completely
            await this.waitForPageLoad();
            
            // Verify we're on the correct tab (should have waitlist attendees)
            await this.ensureWaitlistTab();
            
            // Get estimated total for progress tracking
            this.totalCount = this.getEstimatedTotal();
            
            // Determine processing strategy based on name filter
            if (this.nameFilter.length > 0) {
                this.sendMessage('status', `Name filter provided. Loading all attendees first...`, 'info');
                await this.processWithNameFilter();
            } else {
                this.sendMessage('status', `Starting batch processing for all attendees...`, 'info');
                await this.processBatchMode();
            }

            if (this.isRunning) {
                const targetStatus = this.meetupType === 'past' ? 'Went' : 'Going';
                let completionMessage = `Successfully updated ${this.processedCount} attendees to "${targetStatus}" status`;
                if (this.skippedCount > 0) {
                    completionMessage += ` (${this.skippedCount} skipped)`;
                }
                this.sendMessage('completed', completionMessage, 'success', {
                    total: this.processedCount,
                    skipped: this.skippedCount
                });
            }
        } catch (error) {
            this.sendMessage('error', error.message, 'error');
        }
    }

    async waitForPageLoad() {
        // Wait for the attendee list to be present
        await this.waitForElement('[data-testid="attendee-tool"]', 10000);
        await this.sleep(1000); // Additional wait for dynamic content
    }

    getEstimatedTotal() {
        // Try to get total count from the page if available
        const tabs = document.querySelectorAll('[data-testid="attendees-tab-container"] button');
        for (const tab of tabs) {
            if (tab.textContent.includes('Waitlist') || tab.textContent.includes('waitlist')) {
                const match = tab.textContent.match(/(\d+)/);
                if (match) {
                    return parseInt(match[1]);
                }
            }
        }
        // Fallback to current visible count
        return this.getCurrentVisibleAttendees().length;
    }

    async processCurrentViewAttendees(batchNumber) {
        this.sendMessage('status', `Processing batch ${batchNumber}...`, 'info');
        
        // Always ensure we're on the waitlist tab before processing
        await this.ensureWaitlistTab();
        
        // Get currently visible attendees (excluding already processed ones)
        const attendeeTools = this.getCurrentVisibleAttendees();
        
        if (attendeeTools.length === 0) {
            this.sendMessage('status', `No new attendees found in batch ${batchNumber} (all already processed)`, 'info');
            return 0;
        }
        
        this.sendMessage('status', `Found ${attendeeTools.length} new attendees in batch ${batchNumber}`, 'info');
        
        let processedInBatch = 0;
        let alreadyProcessedInBatch = 0;
        
        // Process each attendee in current view
        for (let i = 0; i < attendeeTools.length && this.isRunning; i++) {
            try {
                // Always ensure we're on waitlist tab before each attendee
                await this.ensureWaitlistTab();
                
                const result = await this.processAttendee(attendeeTools[i], this.processedCount + this.skippedCount + 1);
                
                if (result.processed) {
                    this.processedCount++;
                    processedInBatch++;
                    
                    this.sendMessage('progress', null, null, {
                        current: this.processedCount,
                        total: this.totalCount,
                        skipped: this.skippedCount
                    });
                } else if (result.skipped) {
                    this.skippedCount++;
                } else if (result.alreadyProcessed) {
                    alreadyProcessedInBatch++;
                    // Don't increment counters for already processed attendees
                }
                
                // Wait between processing attendees
                if (i < attendeeTools.length - 1 && this.isRunning) {
                    await this.sleep(this.delay);
                }
            } catch (error) {
                console.error(`Error processing attendee ${this.processedCount + this.skippedCount + 1}:`, error);
                this.sendMessage('status', `Warning: ${error.message}`, 'info');
                // Continue with next attendee instead of stopping
            }
        }
        
        let statusMessage = `Completed batch ${batchNumber}: processed ${processedInBatch} attendees`;
        if (alreadyProcessedInBatch > 0) {
            statusMessage += `, skipped ${alreadyProcessedInBatch} already processed`;
        }
        this.sendMessage('status', statusMessage, 'info');
        return processedInBatch;
    }

    getCurrentVisibleAttendees() {
        // Get attendee tools that are currently visible in viewport or close to it
        const attendeeTools = Array.from(document.querySelectorAll('[data-testid="attendee-tool"]'));
        
        return attendeeTools.filter(tool => {
            if (!tool.offsetParent || tool.getBoundingClientRect().height === 0) {
                return false; // Not visible
            }
            
            // Skip attendees that have already been processed
            const attendeeId = this.getAttendeeId(tool);
            if (this.processedAttendeeIds.has(attendeeId)) {
                return false; // Already processed
            }
            
            const rect = tool.getBoundingClientRect();
            const viewport = {
                top: 0,
                bottom: window.innerHeight
            };
            
            // Include elements that are visible or slightly below viewport (for smooth processing)
            return rect.top < viewport.bottom + 200; // 200px buffer below viewport
        });
    }

    async scrollToLoadMore() {
        // Get count of unprocessed attendees before scrolling
        const beforeScrollCount = this.getCurrentVisibleAttendees().length;
        
        // Scroll down to load more content
        window.scrollBy(0, window.innerHeight);
        await this.sleep(1000); // Wait for scroll to complete
        
        // Get count of unprocessed attendees after scrolling
        const afterScrollCount = this.getCurrentVisibleAttendees().length;
        
        // Return true if we found new unprocessed attendees, false if we've reached the end
        const hasNewAttendees = afterScrollCount > beforeScrollCount;
        
        if (hasNewAttendees) {
            console.log(`Scroll loaded ${afterScrollCount - beforeScrollCount} new unprocessed attendees`);
        } else {
            console.log('No new unprocessed attendees found after scrolling');
        }
        
        return hasNewAttendees;
    }

    async ensureWaitlistTab() {
        const tabContainer = document.querySelector('[data-testid="attendees-tab-container"]');
        if (!tabContainer) {
            throw new Error('Tab container not found');
        }
        
        // Check if we're currently on a different tab (has bg-white and specific content)
        const activeTab = tabContainer.querySelector('button.bg-white:not(.text-gray6)');
        if (activeTab && (activeTab.textContent.includes('Going') || activeTab.textContent.includes('Went'))) {
            this.sendMessage('status', `Detected switch to "${activeTab.textContent.trim()}" tab. Returning to Waitlist...`, 'info');
            this.hasTabSwitched = true;
            
            // Find and click the waitlist tab
            const waitlistTab = Array.from(tabContainer.querySelectorAll('button')).find(btn => 
                btn.textContent.includes('Waitlist') || btn.textContent.includes('waitlist')
            );
            
            if (waitlistTab) {
                waitlistTab.click();
                await this.sleep(3000); // Longer wait for tab to fully load
                
                // Verify we successfully switched back
                const newActiveTab = tabContainer.querySelector('button.bg-white:not(.text-gray6)');
                if (newActiveTab && !newActiveTab.textContent.includes('Waitlist')) {
                    throw new Error('Failed to return to Waitlist tab');
                }
                
                this.sendMessage('status', 'Successfully returned to Waitlist tab', 'info');
            } else {
                throw new Error('Could not find Waitlist tab to return to');
            }
        }
    }

    // Legacy methods for backward compatibility
    async loadAllAttendees() {
        // This method is now replaced by the batch processing approach
        // but kept for compatibility
        this.sendMessage('status', 'Using new batch processing approach...', 'info');
    }

    getAttendeeId(attendeeTool) {
        // Generate a unique identifier for an attendee tool element
        // Use a combination of position in DOM and attendee name for uniqueness
        const attendeeName = this.extractAttendeeName(attendeeTool);
        const parentCard = attendeeTool.closest('.w-full.space-y-4') || attendeeTool.parentElement;
        
        // Try to get a unique identifier from the element
        const dataAttributes = [];
        for (const attr of attendeeTool.attributes) {
            if (attr.name.startsWith('data-')) {
                dataAttributes.push(`${attr.name}=${attr.value}`);
            }
        }
        
        // Create a unique ID based on name, position, and any data attributes
        const elementPosition = Array.from(document.querySelectorAll('[data-testid="attendee-tool"]')).indexOf(attendeeTool);
        const uniqueId = `${attendeeName}_${elementPosition}_${dataAttributes.join('_')}`;
        
        return uniqueId;
    }

    async processAttendee(attendeeTool, attendeeNumber) {
        try {
            // Generate unique ID for this attendee
            const attendeeId = this.getAttendeeId(attendeeTool);
            
            // Check if already processed
            if (this.processedAttendeeIds.has(attendeeId)) {
                console.log(`Skipping attendee ${attendeeNumber}: already processed in previous batch`);
                return { processed: false, skipped: false, alreadyProcessed: true };
            }

            // Verify this attendee tool is still valid and visible
            if (!attendeeTool.offsetParent || attendeeTool.getBoundingClientRect().height === 0) {
                throw new Error(`Attendee ${attendeeNumber} element is no longer visible`);
            }

            // Extract attendee name first for logging
            const attendeeName = this.extractAttendeeName(attendeeTool);
            
            // For name filter mode, we already know this attendee matches
            if (this.nameFilter.length > 0) {
                console.log(`Processing attendee ${attendeeNumber}: "${attendeeName}" (pre-filtered match)`);
                this.sendMessage('status', `Processing: "${attendeeName}" (matches filter)`, 'info');
            } else {
                // For batch mode, check name filter if specified
                if (!this.matchesNameFilter(attendeeName)) {
                    console.log(`Skipping attendee ${attendeeNumber}: "${attendeeName}" (not in filter list)`);
                    this.sendMessage('status', `Skipped: "${attendeeName}" (not in filter)`, 'info');
                    this.processedAttendeeIds.add(attendeeId);
                    return { processed: false, skipped: true };
                }
                console.log(`Processing attendee ${attendeeNumber}: "${attendeeName}"`);
                this.sendMessage('status', `Processing: "${attendeeName}"`, 'info');
            }

            // Scroll attendee into view
            attendeeTool.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
            await this.sleep(800);

            // Find the menu button with improved selectors
            const menuButton = this.findMenuButton(attendeeTool);
            if (!menuButton) {
                throw new Error(`Menu button not found for attendee ${attendeeNumber}: "${attendeeName}"`);
            }

            // Ensure menu button is visible and clickable
            if (!menuButton.offsetParent || menuButton.getBoundingClientRect().height === 0) {
                throw new Error(`Menu button for attendee ${attendeeNumber}: "${attendeeName}" is not visible`);
            }

            // Check if dropdown is already open and close it safely
            await this.closeAnyOpenDropdown();

            // Click the menu button
            console.log(`Clicking menu button for: "${attendeeName}"`);
            console.log('Menu button element:', menuButton);
            console.log('Menu button HTML:', menuButton.outerHTML);
            
            menuButton.click();
            await this.sleep(1500); // Increased wait time for dropdown animation
            
            // Check if dropdown appeared
            const dropdownCheck = document.querySelector('[role="menu"], [aria-expanded="true"], .dropdown-menu');
            console.log('Dropdown appeared:', !!dropdownCheck);
            if (dropdownCheck) {
                console.log('Dropdown content:', dropdownCheck.textContent);
            }

            // Wait for dropdown menu to appear and find the target button
            const targetButton = await this.findTargetButton();
            if (!targetButton) {
                const targetStatus = this.meetupType === 'past' ? 'Went' : 'Going';
                throw new Error(`"Move to ${targetStatus}" button not found for attendee ${attendeeNumber}: "${attendeeName}"`);
            }

            // Verify the button is still valid before clicking
            if (!targetButton.offsetParent || targetButton.getBoundingClientRect().height === 0) {
                const targetStatus = this.meetupType === 'past' ? 'Went' : 'Going';
                throw new Error(`"Move to ${targetStatus}" button for attendee ${attendeeNumber}: "${attendeeName}" is not clickable`);
            }

            // Click the target button
            const targetStatus = this.meetupType === 'past' ? 'Went' : 'Going';
            console.log(`Clicking "Move to ${targetStatus}" for: "${attendeeName}"`);
            targetButton.click();
            await this.sleep(2000); // Longer wait for action to complete and potential tab switch

            console.log(`Successfully updated attendee ${attendeeNumber}: "${attendeeName}" to "${targetStatus}" status`);
            this.sendMessage('status', `Updated: "${attendeeName}" → "${targetStatus}"`, 'success');
            
            // Mark this attendee as processed
            this.processedAttendeeIds.add(attendeeId);
            
            return { processed: true, skipped: false };
            
        } catch (error) {
            // Always try to close any open dropdown before throwing error
            await this.closeAnyOpenDropdown();
            throw error;
        }
    }

    findMenuButton(attendeeTool) {
        // Try multiple selectors to find the menu button (three dots)
        // Based on actual HTML structure, prioritize the most accurate selectors
        const menuSelectors = [
            'button[aria-haspopup="menu"]', // Primary selector from actual HTML
            'button[aria-haspopup="menu"][aria-expanded="false"]',
            'button[data-testid*="menu"]',
            'button[aria-label*="menu"]',
            'button[aria-label*="Menu"]',
            'button[title*="menu"]',
            'button[title*="Menu"]',
            // Look for buttons containing the three dots icon
            'button:has(svg[data-src*="tool.svg"])',
            'button:has([data-icon-c="icon-263"])',
            // Fallback: look for any button with SVG that might be the menu
            'button svg[viewBox="0 0 20 20"]',
            'button [data-icon="icon-263"]'
        ];
        
        for (const selector of menuSelectors) {
            try {
                const button = attendeeTool.querySelector(selector);
                if (button && button.offsetParent !== null) {
                    // Verify it's actually a menu button
                    const buttonContent = button.innerHTML.toLowerCase();
                    const ariaHaspopup = button.getAttribute('aria-haspopup');
                    
                    // Prioritize buttons with proper aria attributes
                    if (ariaHaspopup === 'menu') {
                        return button;
                    }
                    
                    // Secondary validation for other selectors
                    if (buttonContent.includes('tool') || 
                        buttonContent.includes('menu') || 
                        buttonContent.includes('icon-263')) {
                        return button;
                    }
                }
            } catch (error) {
                // Continue trying other selectors
                continue;
            }
        }
        
        // Final fallback: look for any button that might be the menu in the attendee tool
        const allButtons = attendeeTool.querySelectorAll('button');
        for (const button of allButtons) {
            if (button.offsetParent !== null) {
                const buttonHTML = button.innerHTML;
                // Check for SVG or icon patterns that indicate a menu
                if (buttonHTML.includes('viewBox="0 0 20 20"') || 
                    buttonHTML.includes('data-icon') ||
                    buttonHTML.includes('tool.svg') ||
                    button.querySelector('svg')) {
                    return button;
                }
            }
        }
        
        return null;
    }

    async findTargetButton() {
        // Wait a bit for dropdown to fully render
        await this.sleep(1000);
        
        const targetStatus = this.meetupType === 'past' ? 'Went' : 'Going';
        console.log(`Looking for "Move to ${targetStatus}" button...`);
        console.log(`Meetup type: ${this.meetupType}, Target status: ${targetStatus}`);
        
        // First, try to find the dropdown/menu container
        const dropdownSelectors = [
            '[role="menu"]',
            '[aria-expanded="true"]',
            '.dropdown-menu',
            '[data-testid*="dropdown"]',
            '[data-testid*="menu"]',
            // Look for recently appeared elements (dropdown)
            '*[style*="position: absolute"]',
            '*[style*="position: fixed"]'
        ];
        
        let dropdownArea = null;
        for (const selector of dropdownSelectors) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) {
                dropdownArea = element;
                console.log(`Found dropdown area with selector: ${selector}`);
                break;
            }
        }
        
        // Look for buttons that contain "Move to" and the target status text
        const searchAreas = dropdownArea ? [dropdownArea, document] : [document];
        
        for (const area of searchAreas) {
            const allButtons = area.querySelectorAll('button');
            console.log(`Searching ${allButtons.length} buttons in ${area === document ? 'document' : 'dropdown area'}`);
            
            for (const button of allButtons) {
                if (button.offsetParent !== null && button.textContent) {
                    const buttonText = button.textContent.trim();
                    console.log(`Checking button text: "${buttonText}"`);
                    
                    // Check for exact matches first with precise matching
                    if (buttonText.includes(`Move to "${targetStatus}"`) || 
                        buttonText.includes(`Move to ${targetStatus}`) ||
                        buttonText === `Move to "${targetStatus}"` ||
                        buttonText === `Move to ${targetStatus}`) {
                        console.log(`Found target button: "${buttonText}"`);
                        return button;
                    }
                    
                    // More precise matching for "Move to" + status
                    if (buttonText.includes('Move to') && this.isExactStatusMatch(buttonText, targetStatus)) {
                        console.log(`Found target button with exact status match: "${buttonText}"`);
                        return button;
                    }
                    
                    // Log buttons that contain "Going" for debugging
                    if (buttonText.toLowerCase().includes('going')) {
                        console.log(`Button contains "going": "${buttonText}" - exact match: ${this.isExactStatusMatch(buttonText, targetStatus)}`);
                    }
                }
            }
        }
        
        // Fallback: look for any button containing just the target status with exact matching
        console.log(`Fallback: looking for buttons with exact "${targetStatus}" match`);
        const allButtons = document.querySelectorAll('button');
        for (const button of allButtons) {
            if (button.offsetParent !== null && button.textContent) {
                const buttonText = button.textContent.trim();
                if (buttonText.includes('move') && this.isExactStatusMatch(buttonText, targetStatus)) {
                    console.log(`Found fallback button: "${buttonText}"`);
                    return button;
                }
            }
        }
        
        // Final fallback: look for buttons with specific class patterns with exact matching
        const targetButtons = document.querySelectorAll('button.flex, button[class*="flex"]');
        for (const button of targetButtons) {
            if (button.offsetParent !== null && button.textContent) {
                const buttonText = button.textContent.trim();
                if (this.isExactStatusMatch(buttonText, targetStatus)) {
                    console.log(`Found class-based button: "${buttonText}"`);
                    return button;
                }
            }
        }

        console.log(`No "${targetStatus}" button found`);
        return null;
    }

    async closeAnyOpenDropdown() {
        // More precise click to close dropdowns without hitting tab buttons
        // First try to find an already open dropdown and close it properly
        const openDropdown = document.querySelector('[aria-expanded="true"]');
        if (openDropdown) {
            openDropdown.click();
            await this.sleep(300);
            return;
        }
        
        // If no specific dropdown found, click on a safe area
        // Find a safe area to click that won't accidentally hit tab buttons
        const safeAreas = [
            '.min-h-\\[80vh\\]', // Main content area
            '[data-testid="attendee-search"]', // Search area
            '.mt-6' // Various margin areas
        ];
        
        for (const selector of safeAreas) {
            const safeArea = document.querySelector(selector);
            if (safeArea && safeArea.offsetParent !== null) { // is visible
                // Click on the element but make sure it's not a tab button
                const rect = safeArea.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + 10,
                    clientY: rect.top + 10
                });
                safeArea.dispatchEvent(clickEvent);
                await this.sleep(300);
                return;
            }
        }
        
        // Last resort: press Escape key to close any dropdowns
        const escapeEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escapeEvent);
        await this.sleep(300);
    }

    async waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await this.sleep(100);
        }
        throw new Error(`Element ${selector} not found within ${timeout}ms`);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
    }

    sendMessage(type, message, level, extra = {}) {
        const messageData = {
            type: type,
            message: message,
            level: level,
            ...extra
        };
        
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage(messageData).catch(error => {
                    console.log('Failed to send message to popup:', error);
                    console.log('Message was:', messageData);
                });
            } else {
                console.log('Chrome runtime not available. Message:', messageData);
            }
        } catch (error) {
            console.log('Error sending message:', error);
            console.log('Message was:', messageData);
        }
    }

    async validateCurrentTab() {
        // Check if we accidentally navigated to a different tab
        const tabContainer = document.querySelector('[data-testid="attendees-tab-container"]');
        if (!tabContainer) {
            throw new Error('Tab container not found - page may have changed');
        }
        
        // Look for attendee tools - if none found, we might be on wrong tab
        const attendeeTools = document.querySelectorAll('[data-testid="attendee-tool"]');
        if (attendeeTools.length === 0) {
            // Check if we're on "Went" tab and try to go back to waitlist
            const wentTab = tabContainer.querySelector('button[class*="bg-white"]:not([class*="text-gray6"])');
            if (wentTab && wentTab.textContent.includes('Went')) {
                this.sendMessage('status', 'Detected navigation to "Went" tab. Attempting to return to original tab...', 'info');
                
                // Click on waitlist tab to return
                const waitlistTab = Array.from(tabContainer.querySelectorAll('button')).find(btn => 
                    btn.textContent.includes('Waitlist') || btn.textContent.includes('waitlist')
                );
                
                if (waitlistTab) {
                    waitlistTab.click();
                    await this.sleep(2000); // Wait for tab to load
                    
                    // Check if we now have attendees
                    const newAttendeeTools = document.querySelectorAll('[data-testid="attendee-tool"]');
                    if (newAttendeeTools.length === 0) {
                        throw new Error('No attendees found after returning to original tab. Process stopped to prevent errors.');
                    }
                    this.sendMessage('status', 'Successfully returned to original tab with attendees', 'info');
                } else {
                    throw new Error('Could not find the original tab to return to. Process stopped.');
                }
            } else {
                throw new Error('No attendees found on current tab. Process stopped.');
            }
        }
    }

    extractAttendeeName(attendeeTool) {
        // First, try to find the name in the attendee card structure
        // Based on the actual HTML, the name is in a p.font-medium element
        let parentCard = attendeeTool.closest('.w-full.space-y-4');
        if (!parentCard) {
            // Try alternative parent selectors
            parentCard = attendeeTool.closest('[class*="shadow"]') || 
                        attendeeTool.closest('.flex.flex-col') ||
                        attendeeTool.parentElement;
        }
        
        if (parentCard) {
            // Look for the attendee name in the card button
            const cardButton = parentCard.querySelector('button[data-event-label="attendee-card"]');
            if (cardButton) {
                const nameElement = cardButton.querySelector('p.font-medium');
                if (nameElement && nameElement.textContent) {
                    const name = nameElement.textContent.trim();
                    if (this.isValidName(name)) {
                        return name;
                    }
                }
            }
            
            // Fallback: look for any p.font-medium in the parent card
            const nameElement = parentCard.querySelector('p.font-medium');
            if (nameElement && nameElement.textContent) {
                const name = nameElement.textContent.trim();
                if (this.isValidName(name)) {
                    return name;
                }
            }
        }
        
        // Secondary approach: try multiple selectors within the attendee tool itself
        const nameSelectors = [
            'p.font-medium',
            '[data-testid="attendee-name"]',
            '.attendee-name',
            'h3',
            'h4',
            'h5',
            '.font-semibold',
            '.text-lg',
            '.text-base',
            'a[href*="/members/"]',
            'a[href*="/profile/"]'
        ];
        
        for (const selector of nameSelectors) {
            const nameElement = attendeeTool.querySelector(selector);
            if (nameElement && nameElement.textContent) {
                const name = nameElement.textContent.trim();
                if (this.isValidName(name)) {
                    return name;
                }
            }
        }
        
        // Last resort: parse text content
        const allText = attendeeTool.textContent || '';
        const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        for (const line of lines.slice(0, 5)) {
            if (this.isValidName(line)) {
                return line;
            }
        }
        
        return 'Unknown';
    }
    
    isValidName(name) {
        // Validate that this looks like a name
        return name && name.length > 1 && name.length < 100 && 
               !name.includes('Joined') && !name.includes('RSVP') && 
               !name.includes('@') && !name.includes('http') &&
               !name.includes('Member') && !name.includes('Organizer') &&
               !name.includes('Waitlist') && !name.includes('Going') &&
               !name.includes('Went') && !name.includes('Apr ') &&
               // Must contain at least one letter
               /[a-zA-Z]/.test(name) &&
               // Shouldn't be all numbers or special characters
               !/^[\d\s\-\+\(\)]+$/.test(name);
    }

    matchesNameFilter(attendeeName) {
        if (!this.nameFilter || this.nameFilter.length === 0) {
            return true; // No filter means include all
        }
        
        const normalizedAttendeeName = attendeeName.toLowerCase().trim();
        
        return this.nameFilter.some(filterName => {
            const normalizedFilterName = filterName.toLowerCase().trim();
            
            // Exact match
            if (normalizedAttendeeName === normalizedFilterName) {
                return true;
            }
            
            // Handle common name variations (all filter name parts must be exact matches in attendee name)
            const attendeeNameParts = normalizedAttendeeName.split(/\s+/);
            const filterNameParts = normalizedFilterName.split(/\s+/);
            
            // Check if all filter name parts are present as exact matches in attendee name
            const allPartsMatch = filterNameParts.every(filterPart =>
                attendeeNameParts.some(attendeePart => 
                    attendeePart === filterPart
                )
            );
            
            return allPartsMatch;
        });
    }
    
    isExactStatusMatch(buttonText, targetStatus) {
        // Helper function to ensure exact status matching
        // This prevents "Going" from matching "Not Going"
        const normalizedButtonText = buttonText.toLowerCase();
        const normalizedTargetStatus = targetStatus.toLowerCase();
        
        if (targetStatus === 'Going') {
            // For "Going", make sure it's not "Not Going"
            return normalizedButtonText.includes(normalizedTargetStatus) && 
                   !normalizedButtonText.includes('not going');
        } else if (targetStatus === 'Went') {
            // For "Went", make sure it's exact match
            return normalizedButtonText.includes(normalizedTargetStatus);
        }
        
        // Default case: just check if target status is included
        return normalizedButtonText.includes(normalizedTargetStatus);
    }

    async processWithNameFilter() {
        this.sendMessage('status', `Filtering by ${this.nameFilter.length} names: ${this.nameFilter.slice(0, 3).join(', ')}${this.nameFilter.length > 3 ? '...' : ''}`, 'info');
        
        // Step 1: Load all attendees by scrolling to the end
        this.sendMessage('status', 'Loading all attendees...', 'info');
        await this.loadAllAttendeesByScrolling();
        
        // Step 2: Get all attendees and find matches
        const allAttendees = this.getAllVisibleAttendees();
        const matchingAttendees = [];
        
        this.sendMessage('status', `Found ${allAttendees.length} total attendees. Finding matches...`, 'info');
        
        for (const attendee of allAttendees) {
            const name = this.extractAttendeeName(attendee);
            if (this.matchesNameFilter(name)) {
                matchingAttendees.push({ element: attendee, name: name });
            }
        }
        
        if (matchingAttendees.length === 0) {
            this.sendMessage('status', 'No matching attendees found for the provided name filter', 'info');
            return;
        }
        
        this.sendMessage('status', `Found ${matchingAttendees.length} matching attendees. Processing...`, 'info');
        this.totalCount = matchingAttendees.length; // Update total for progress tracking
        
        // Step 3: Process each matching attendee
        for (let i = 0; i < matchingAttendees.length && this.isRunning; i++) {
            const { element, name } = matchingAttendees[i];
            
            try {
                // Always ensure we're on waitlist tab before processing
                await this.ensureWaitlistTab();
                
                // If tab has switched, reload all attendees and find the current one
                if (this.hasTabSwitched) {
                    this.sendMessage('status', 'Tab switched detected. Reloading attendees...', 'info');
                    await this.loadAllAttendeesByScrolling();
                    
                    // Find the attendee again after tab switch
                    const reloadedAttendees = this.getAllVisibleAttendees();
                    let foundAttendee = null;
                    
                    for (const reloadedAttendee of reloadedAttendees) {
                        const reloadedName = this.extractAttendeeName(reloadedAttendee);
                        if (reloadedName === name) {
                            foundAttendee = reloadedAttendee;
                            break;
                        }
                    }
                    
                    if (!foundAttendee) {
                        this.sendMessage('status', `Could not find "${name}" after tab switch. Skipping...`, 'info');
                        this.skippedCount++;
                        continue;
                    }
                    
                    // Update element reference
                    matchingAttendees[i].element = foundAttendee;
                    this.hasTabSwitched = false; // Reset flag
                }
                
                this.sendMessage('status', `Processing ${i + 1}/${matchingAttendees.length}: "${name}"`, 'info');
                
                const result = await this.processAttendee(matchingAttendees[i].element, i + 1);
                
                if (result.processed) {
                    this.processedCount++;
                    this.sendMessage('progress', null, null, {
                        current: this.processedCount,
                        total: this.totalCount,
                        skipped: this.skippedCount
                    });
                } else if (result.skipped) {
                    this.skippedCount++;
                }
                
                // Wait between processing attendees
                if (i < matchingAttendees.length - 1 && this.isRunning) {
                    await this.sleep(this.delay);
                }
                
            } catch (error) {
                console.error(`Error processing attendee "${name}":`, error);
                this.sendMessage('status', `Warning: Failed to process "${name}": ${error.message}`, 'info');
                this.skippedCount++;
                
                // If error mentions tab switch, set flag
                if (error.message.includes('no longer visible') || error.message.includes('not found')) {
                    this.hasTabSwitched = true;
                }
            }
        }
    }

    async processBatchMode() {
        this.sendMessage('status', `Starting batch processing for all attendees...`, 'info');
        
        const targetStatus = this.meetupType === 'past' ? 'Went' : 'Going';
        this.sendMessage('status', `Moving attendees to "${targetStatus}" status`, 'info');
        
        // Process attendees in batches (visible attendees, then scroll)
        let hasMoreAttendees = true;
        let batchNumber = 1;
        
        while (hasMoreAttendees && this.isRunning) {
            try {
                // Always ensure we're on the waitlist tab before processing batch
                await this.ensureWaitlistTab();
                
                // Process current visible attendees
                const processed = await this.processCurrentViewAttendees(batchNumber);
                
                if (processed === 0) {
                    // No attendees found in current view, try scrolling
                    const scrolled = await this.scrollToLoadMore();
                    if (!scrolled) {
                        hasMoreAttendees = false;
                        break;
                    }
                    // Wait for new content to load after scrolling
                    await this.sleep(this.scrollDelay);
                } else {
                    // Successfully processed some attendees, scroll for more
                    batchNumber++;
                    const scrolled = await this.scrollToLoadMore();
                    if (!scrolled) {
                        hasMoreAttendees = false;
                    } else {
                        // Wait for new content to load
                        await this.sleep(this.scrollDelay);
                    }
                }
            } catch (error) {
                console.error(`Error in batch ${batchNumber}:`, error);
                this.sendMessage('status', `Warning in batch ${batchNumber}: ${error.message}`, 'info');
                
                // If error mentions tab switch, try to recover
                if (error.message.includes('no longer visible') || error.message.includes('not found')) {
                    this.hasTabSwitched = true;
                    await this.ensureWaitlistTab();
                }
                
                // Try to continue with next batch
                batchNumber++;
                const scrolled = await this.scrollToLoadMore();
                if (!scrolled) {
                    hasMoreAttendees = false;
                } else {
                    await this.sleep(this.scrollDelay);
                }
            }
        }
    }

    async loadAllAttendeesByScrolling() {
        this.sendMessage('status', 'Loading all attendees by scrolling...', 'info');
        
        let previousCount = 0;
        let currentCount = 0;
        let noChangeCount = 0;
        const maxNoChangeAttempts = 3;
        
        do {
            previousCount = currentCount;
            
            // Scroll to bottom
            window.scrollTo(0, document.body.scrollHeight);
            await this.sleep(this.scrollDelay);
            
            // Get current count
            const allAttendees = this.getAllVisibleAttendees();
            currentCount = allAttendees.length;
            
            this.sendMessage('status', `Loaded ${currentCount} attendees...`, 'info');
            
            // Check if count hasn't changed
            if (currentCount === previousCount) {
                noChangeCount++;
            } else {
                noChangeCount = 0; // Reset if we got new attendees
            }
            
            // Continue until no new attendees are loaded for several attempts
        } while (noChangeCount < maxNoChangeAttempts && this.isRunning);
        
        this.sendMessage('status', `Finished loading. Total attendees: ${currentCount}`, 'info');
        
        // Scroll back to top for processing
        window.scrollTo(0, 0);
        await this.sleep(1000);
    }

    getAllVisibleAttendees() {
        // Get ALL attendee tools on the page, not just visible ones
        const attendeeTools = Array.from(document.querySelectorAll('[data-testid="attendee-tool"]'));
        
        return attendeeTools.filter(tool => {
            // Only filter out truly hidden elements
            return tool.offsetParent !== null;
        });
    }
}

// Create global instance
window.meetupProcessor = new MeetupAttendeeProcessor();

// Listen for messages from popup
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Content script received message:', request);
        
        try {
            if (request.action === 'start') {
                window.meetupProcessor.processAllAttendees(
                    request.delay, 
                    request.scrollDelay, 
                    request.meetupType || 'past',
                    request.nameFilter || ''
                );
                sendResponse({success: true});
            } else if (request.action === 'stop') {
                window.meetupProcessor.stop();
                sendResponse({success: true});
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({success: false, error: error.message});
        }
        
        return true; // Keep message channel open for async response
    });
} else {
    console.log('Chrome runtime not available for message listening');
}
