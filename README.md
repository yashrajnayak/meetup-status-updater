# Meetup Status Manager

![Chromium Extension](https://img.shields.io/badge/Chromium-Extension-blue?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red)

A Chromium extension that automatically updates Meetup event attendee status with advanced filtering capabilities.

**🚀 Save hours of manual work** by automatically updating attendee statuses on Meetup.com events. Perfect for event organizers who need to efficiently manage large attendee lists.

<img width="355" alt="image" src="https://github.com/user-attachments/assets/733ee5d6-3c59-496b-9f15-7afb62e9e3e2" />

## ✨ Key Features

- 🎯 **Dual Mode Support**: Works with both past and future meetups
  - Past meetups: Moves attendees to "Went" status
  - Future meetups: Moves attendees to "Going" status
- ⚡ **Smart Batch Processing**: 
  - Pre-loads all attendees when name filter is provided for maximum efficiency. 
  - Only processes attendees that match the specified names.
  - Efficiently processes attendees in batches, tracking processed attendees to avoid duplicates
- 🔄 **Auto Tab Recovery**: Automatically detects and recovers from Meetup's tab switching behavior
- 📊 **Progress Tracking**: Real-time progress updates with visual indicators
- ⏱️ **Configurable Delays**: Adjust timing between actions and scrolling
- 🛡️ **Auto-Recovery**: Handles page navigation and dropdown states automatically

## 📋 Requirements

- **Chromium-based browser** (Chrome, Edge, Brave, Opera, etc. - version 88 or later)
- **Meetup.com account** with organizer permissions for your events
- **Event attendees page** (URL must contain `/attendees/`)

## 💾 Installation

[![Download Extension](https://img.shields.io/badge/Download-Extension-success?style=for-the-badge&logo=download)](https://github.com/yashrajnayak/meetup-status-updater/archive/refs/heads/main.zip)

1. Download the repository as a ZIP file
2. Extract the ZIP file to a folder on your computer
3. Open your browser and navigate to the extensions page:
     - **Chrome**: `chrome://extensions/`
     - **Edge**: `edge://extensions/`
     - **Brave**: `brave://extensions/`
     - **Opera**: `opera://extensions/`
4. Enable "Developer mode" by toggling the switch, then click "Load unpacked" button and select the extracted extension folder
5. The extension icon should appear in your browser toolbar

## 📖 Usage Instructions

![image](https://github.com/user-attachments/assets/6f947e51-a86c-49cd-8876-65a809f8fdb6)

1. **Navigate to a Meetup event's attendees page** (URL should contain `/attendees/`)
2. **Click the extension icon** in the toolbar
3. **Select meetup type**:
   - **Past Meetup**: Moves attendees to "Went" status
   - **Future Meetup**: Moves attendees to "Going" status
4. **Configure name filter (optional)**:
   - Leave empty to update all attendees
   - Enter specific names (one per line) to filter attendees
5. **Adjust delay settings if needed**:
   - **Delay between actions**: Time to wait between processing each attendee (default: 2000ms)
   - **Scroll delay**: Time to wait when scrolling to load more attendees (default: 3000ms)
6. **Click "Start Auto-Update"** to begin the process
7. **Monitor progress** in the popup - you'll see real-time updates
8. **Wait for completion** - the extension will automatically stop when finished

> **⚠️ Disclaimer**: This extension is not affiliated with, endorsed by, or officially connected to Meetup.com or Meetup Inc. It is an independent, open-source tool created to help event organizers manage their events more efficiently.

## 🛠️ Technical Details

The extension uses:
- **Manifest V3** for Chrome extensions (latest security standards)
- **Content scripts** to interact with the Meetup page
- **Local storage** for user preferences only
- **Automatic scrolling** to handle pagination
- **Robust error handling** and recovery mechanisms

### Browser Permissions Required
- `activeTab`: Access current Meetup.com tab only
- `scripting`: Interact with page elements (click buttons, read content)
- `storage`: Save your preference settings locally
- `host_permissions`: Limited to Meetup.com domain only

### 📁 Project Structure

```
meetup-status-updater/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup logic and UI handling
├── content.js             # Main extension logic (runs on Meetup pages)
├── icon16.png             # Extension icons
├── icon48.png
├── icon128.png
├── README.md              # Main documentation
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # This file
├── LICENSE                # License information
└── docs/                  # Additional documentation
    ├── installation-guide.md
    ├── usage-guide.md
    └── security-privacy.md
```

## ⚠️ Important Notes

- This extension only works on Meetup.com attendees pages
- You must be logged in as an event organizer with permission to change attendee status
- The extension includes delays to avoid overwhelming the website
- Progress is shown in real-time in the extension popup
- If an error occurs with one attendee, the extension will continue with the next one

## 🔧 Troubleshooting

### Common Issues

**Extension Won't Start**:
- Ensure you're on a Meetup attendees page (URL contains `/attendees/`)
- Verify you're logged in as an event organizer
- Check that the Meetup page has fully loaded

**Extension Gets Stuck**:
- Click "Stop Process" and restart
- Try increasing the delay settings
- Refresh the Meetup page and try again

**Some Attendees Skipped**:
- Check name filter for typos (if using filtering)
- Ensure all attendees have loaded by scrolling through the page
- Run the extension again (it will skip already-processed attendees)

**Permission Errors**:
- Verify you have organizer permissions for the event
- Try refreshing your Meetup login
- Check browser console (F12 → Console) for detailed errors

## 🔒 Privacy & Security

### How It Works Securely
✅ **Local processing only**: All operations happen in your browser  
✅ **Minimal permissions**: Only accesses Meetup.com attendees pages  
✅ **No data transmission**: Zero data sent to external servers  
✅ **Open source**: Code is publicly reviewable on GitHub  
✅ **HTTPS only**: Only works on secure Meetup.com pages  

### What It DOESN'T Do
❌ **Collect personal information** (names, emails, profiles)  
❌ **Store browsing history** or track website visits  
❌ **Send data to external servers** or third parties  
❌ **Include analytics or telemetry** of any kind  
❌ **Access other browser tabs** or bookmarks  
❌ **Store credentials** or login information  
❌ **Inject ads** or promotional content  

## 🤝 Support

If you encounter issues, first check:
- You're on the correct page type (Meetup attendees page)
- You have organizer permissions for the event
- The Meetup page has fully loaded before starting
- Browser console for error messages (F12 → Console tab)

**Contributing**:
- [Issue Tracker](../../issues) - Report bugs or request features
- Fork the repository and submit pull requests for improvements

**Remember**: This extension automates the same manual process you would do - it just saves you time by clicking the buttons automatically!
