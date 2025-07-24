# Meetup Status Manager

![Chromium Extension](https://img.shields.io/badge/Chromium-Extension-blue?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red)

A powerful Chromium extension that automatically updates Meetup event attendee statuses with advanced filtering capabilities and multi-tab support.

**🚀 Save hours of manual work** by automatically moving attendees between Waitlist, Going, and Went statuses on Meetup.com events. Perfect for event organizers who need to efficiently manage large attendee lists across different status categories.

<img width="355" alt="image" src="https://github.com/user-attachments/assets/733ee5d6-3c59-496b-9f15-7afb62e9e3e2" />

## ✨ Key Features

- 🎯 **Complete Multi-Tab Support**: Works seamlessly with both Waitlist and Going tabs
  - **From Waitlist**: Move attendees to "Going" (future meetups) or "Went" (past meetups)
  - **From Going**: Move attendees back to "Waitlist" for re-organization
  - **Smart Auto-Detection**: Automatically determines source tab based on your selected action
- ⚡ **Intelligent Batch Processing**: 
  - Pre-loads all attendees when name filter is provided for maximum efficiency
  - Only processes attendees that match the specified names
  - Efficiently processes attendees in batches, tracking processed attendees to avoid duplicates
  - Handles large attendee lists with automatic scrolling and pagination
- 🔄 **Advanced Auto-Recovery**: 
  - Automatically detects and recovers from Meetup's tab switching behavior
  - Handles page navigation changes during processing
  - Resumes processing after temporary interruptions
- 📊 **Real-Time Progress Tracking**: 
  - Live progress updates with visual indicators
  - Shows processed count, total count, and skipped attendees
  - Detailed status messages for each operation
- ⏱️ **Configurable Timing Controls**: 
  - Adjustable delays between actions to respect server limits
  - Customizable scroll timing for loading more attendees
  - Prevents overwhelming Meetup's servers
- 🛡️ **Robust Error Handling**: 
  - Continues processing even if individual attendees fail
  - Automatic dropdown state management
  - Comprehensive error recovery mechanisms
- 🔍 **Advanced Name Filtering**: 
  - Process only specific attendees by name
  - Supports partial name matching
  - Bulk filtering with one name per line

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

### Step-by-Step Guide

1. **📍 Navigate to Event Page**
   - Go to your Meetup event's attendees page (URL should contain `/attendees/`)
   - Ensure you're logged in as an event organizer with appropriate permissions

2. **🔧 Open Extension**
   - Click the extension icon in your browser toolbar
   - The popup interface will appear with configuration options

3. **🎯 Choose Your Action**
   - **Past Meetup (Move to "Went")**: Moves attendees from Waitlist to Went status
   - **Future Meetup (Move to "Going")**: Moves attendees from Waitlist to Going status  
   - **Move to "Waitlist"**: Moves attendees from Going back to Waitlist
   
   *The extension automatically determines which tab to process based on your selected action*

4. **🔍 Configure Name Filter (Optional)**
   - **Leave empty**: Process all attendees in the selected tab
   - **Add specific names**: Enter one name per line to process only those attendees
   - **Example**:
     ```
     John Doe
     Jane Smith
     Alex Johnson
     ```

5. **⚙️ Adjust Timing Settings (Optional)**
   - **Delay between actions**: Time to wait between processing each attendee (default: 2000ms)
   - **Scroll delay**: Time to wait when scrolling to load more attendees (default: 3000ms)
   - *Increase delays if you experience timeouts or errors*

6. **▶️ Start Processing**
   - Click "Start Auto-Update" to begin the automated process
   - The extension will automatically switch to the correct tab if needed

7. **📊 Monitor Progress**
   - Watch real-time updates in the popup window
   - See processed count, total attendees, and any skipped entries
   - Status messages will show current operation details

8. **✅ Completion**
   - The extension will automatically stop when all attendees are processed
   - A completion message will show the final results
   - You can stop the process early using the "Stop Process" button if needed

### 💡 Pro Tips

- **Test with small groups first**: Try the extension with a few attendees to get familiar
- **Use name filtering for precision**: When you only need to move specific people
- **Increase delays for stability**: If you encounter errors, try higher delay values
- **Monitor the browser console**: Press F12 → Console for detailed logging information

> **⚠️ Disclaimer**: This extension is not affiliated with, endorsed by, or officially connected to Meetup.com or Meetup Inc. It is an independent, open-source tool created to help event organizers manage their events more efficiently.

## 🛠️ Technical Details

### Core Technologies
- **Manifest V3**: Latest Chrome extension security standards and best practices
- **Content Scripts**: Direct interaction with Meetup.com pages using modern JavaScript
- **Local Storage**: Secure local storage for user preferences only
- **Automatic Scrolling**: Intelligent pagination handling for large attendee lists
- **Robust Error Handling**: Comprehensive recovery mechanisms and failsafes

### Architecture Overview
The extension consists of three main components:

1. **Popup Interface** (`popup.html` + `popup.js`)
   - User-friendly configuration interface
   - Real-time progress tracking and status updates
   - Settings persistence and validation

2. **Content Script** (`content.js`)
   - Core automation logic running on Meetup pages
   - DOM manipulation and attendee processing
   - Tab navigation and state management

3. **Background Service** (Manifest V3)
   - Extension lifecycle management
   - Cross-component communication
   - Permission and security handling

### Browser Permissions Required
- `activeTab`: Access to the currently active Meetup.com tab only
- `scripting`: Ability to interact with page elements (click buttons, read content)
- `storage`: Save user preference settings locally in browser storage
- `host_permissions`: Limited access to Meetup.com domain only for security

### Performance Optimizations
- **Batch Processing**: Processes attendees in efficient batches rather than one-by-one
- **Smart Scrolling**: Only loads additional attendees when needed
- **Duplicate Prevention**: Tracks processed attendees to avoid re-processing
- **Memory Management**: Cleans up resources and prevents memory leaks
- **Rate Limiting**: Configurable delays to respect Meetup's server limits

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
├── LICENSE                # License information
```

## ⚠️ Important Notes & Best Practices

### 🎯 Compatibility & Requirements
- ✅ **Meetup Pages Only**: This extension exclusively works on Meetup.com attendees pages
- ✅ **Organizer Permissions**: You must be logged in as an event organizer with attendee management permissions
- ✅ **Page Loading**: Always wait for the Meetup page to fully load before starting the extension
- ✅ **Browser Support**: Works with all Chromium-based browsers (Chrome, Edge, Brave, Opera, etc.)

### ⚡ Performance & Reliability
- 🔄 **Built-in Delays**: The extension includes configurable delays to avoid overwhelming Meetup's servers
- 📊 **Live Monitoring**: Progress is shown in real-time in the extension popup with detailed status updates
- 🛡️ **Error Resilience**: If an error occurs with one attendee, the extension continues with the next one
- 💾 **State Recovery**: The extension can resume processing after temporary interruptions or tab switches
- 🎛️ **Customizable Timing**: Adjust delays based on your internet speed and Meetup's responsiveness

### 🔍 Processing Logic
- **Smart Detection**: Automatically identifies and processes attendees based on your selected source tab
- **Exact Matching**: Uses precise button text matching to avoid accidental actions
- **Duplicate Prevention**: Tracks processed attendees to prevent re-processing in subsequent runs
- **Batch Optimization**: Processes visible attendees first, then loads more through intelligent scrolling

### 📋 Data Handling
- 🔒 **Local Only**: All processing happens entirely within your browser
- 🚫 **No Data Collection**: The extension doesn't collect, store, or transmit any personal information
- 💻 **Settings Storage**: Only your preference settings (delays, filters) are saved locally
- 🔐 **Privacy First**: No tracking, analytics, or external data transmission of any kind

## 🔧 Troubleshooting

### Common Issues & Solutions

**❌ Extension Won't Start**:
- ✅ Ensure you're on a Meetup attendees page (URL contains `/attendees/`)
- ✅ Verify you're logged in as an event organizer with proper permissions
- ✅ Check that the Meetup page has fully loaded before starting
- ✅ Make sure you've selected the appropriate action type for your needs
- ✅ Try refreshing the page and reopening the extension

**⏳ Extension Gets Stuck or Slow**:
- ✅ Click "Stop Process" and restart with higher delay settings
- ✅ Increase both action delay (try 3000ms) and scroll delay (try 4000ms)
- ✅ Refresh the Meetup page and try again
- ✅ Verify you have the correct action type selected for your intended operation
- ✅ Check your internet connection stability

**⚠️ Some Attendees Skipped**:
- ✅ Check name filter for typos (if using name filtering)
- ✅ Ensure all attendees have loaded by manually scrolling through the page first
- ✅ Run the extension again (it will automatically skip already-processed attendees)
- ✅ Verify the action type matches where the attendees currently are (e.g., use "Move to Waitlist" only when attendees are in Going status)
- ✅ Check that attendee names in filter match exactly as shown on Meetup

**🔄 Wrong Tab or Navigation Errors**:
- ✅ Extension automatically switches to correct tab based on your action type
- ✅ If tab switching fails, manually navigate to the appropriate tab:
  - For "Move to Went/Going": Start on the Waitlist tab
  - For "Move to Waitlist": Start on the Going tab
- ✅ Refresh the page if tab switching seems stuck
- ✅ Clear browser cache and cookies for Meetup.com
- ✅ Try using the extension in an incognito/private window

**🔒 Permission or Access Errors**:
- ✅ Verify you have organizer permissions for the specific event
- ✅ Try logging out and back into Meetup.com
- ✅ Check browser console (F12 → Console) for detailed error messages
- ✅ Ensure the event hasn't been closed or cancelled
- ✅ Verify your organizer role hasn't been revoked

**🐛 Technical Issues**:
- ✅ Update your browser to the latest version
- ✅ Disable other extensions temporarily to check for conflicts
- ✅ Try the extension in a different Chromium-based browser
- ✅ Check browser console (F12 → Console) for JavaScript errors
- ✅ Reload the extension from the extensions page

### 📞 Getting Help

If you continue experiencing issues:

1. **Check the Browser Console**: Press F12 → Console tab for detailed error logs
2. **Document the Issue**: Note which step fails and any error messages
3. **Test Environment**: Try with different events, browsers, or networks
4. **Report Issues**: Use the [GitHub Issues](../../issues) page with:
   - Browser version and type
   - Meetup event URL (remove sensitive info)
   - Screenshot of error messages
   - Steps to reproduce the problem

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

## 🤝 Support & Contributing

### 🆘 Getting Help

Before reporting issues, please:
- ✅ Review the troubleshooting section above
- ✅ Check that you're using a supported browser and have organizer permissions
- ✅ Verify you're on the correct Meetup attendees page
- ✅ Look at browser console messages (F12 → Console) for detailed error information

### 🐛 Reporting Issues

When reporting bugs, please include:
- **Browser version and type** (Chrome 118, Edge 119, etc.)
- **Operating system** (Windows 11, macOS 14, etc.)
- **Meetup event details** (number of attendees, event type - remove sensitive info)
- **Screenshot of error messages** or unexpected behavior
- **Steps to reproduce** the problem consistently
- **Console error logs** (F12 → Console) if available

### 💡 Feature Requests

We welcome suggestions for new features! When requesting features:
- Describe the use case and why it would be helpful
- Provide mockups or detailed descriptions if possible
- Consider how it would fit with existing functionality
- Check existing issues to avoid duplicates

### 🔧 Contributing Code

Contributions are welcome! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **Make your changes** with clear, commented code
5. **Test thoroughly** with different scenarios
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to your branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request** with a clear description

### 📝 Development Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Test with multiple browsers if possible
- Ensure compatibility with Meetup's current page structure
- Update documentation for new features

### 🔗 Resources

- **[Issue Tracker](../../issues)** - Report bugs or request features
- **[Discussions](../../discussions)** - General questions and community support
- **[Wiki](../../wiki)** - Additional documentation and guides
- **[Releases](../../releases)** - Download stable versions and see changelog

---

**💝 Remember**: This extension automates the same manual process you would perform - it just saves you time by clicking the buttons automatically! It's designed to be a helpful tool for busy event organizers who want to focus on creating great experiences rather than managing administrative tasks.
