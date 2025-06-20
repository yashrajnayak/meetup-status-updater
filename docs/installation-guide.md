# Installation Guide

This guide will walk you through installing the Meetup Attendee Status Updater extension from the GitHub repository on any Chromium-based browser.

## Prerequisites

- **Chromium-based browser** (Chrome, Edge, Brave, Opera, etc. - version 88 or later recommended)
- **Active internet connection**
- **Basic computer file management skills**

## Step-by-Step Installation

### Step 1: Download the Extension Files

1. **Navigate to the GitHub repository**:
   - Go to the main repository page
   - You should see the green "Code" button

2. **Download the repository**:
   - Click the green **"Code"** button
   - Select **"Download ZIP"** from the dropdown menu
   - Save the ZIP file to your Downloads folder (or preferred location)

3. **Extract the files**:
   - Locate the downloaded ZIP file (usually in your Downloads folder)
   - Right-click the ZIP file and select "Extract All" (Windows) or double-click (Mac/Linux)
   - Choose a permanent location for the extension files (e.g., `Documents/Chrome Extensions/`)
   - **Important**: Don't delete these files after installation - Chrome needs them to run the extension

### Step 2: Enable Developer Mode

1. **Open browser extensions page**:
   - Open your Chromium-based browser
   - Navigate to the extensions page:
     - **Chrome**: Type `chrome://extensions/` in the address bar
     - **Edge**: Type `edge://extensions/` in the address bar  
     - **Brave**: Type `brave://extensions/` in the address bar
     - **Opera**: Type `opera://extensions/` in the address bar
   - Or go to Menu (⋮) → More Tools → Extensions

2. **Enable Developer Mode**:
   - Look for the "Developer mode" toggle in the top-right corner
   - Click the toggle to turn it **ON**
   - You should see additional buttons appear: "Load unpacked", "Pack extension", "Update"

### Step 3: Install the Extension

1. **Load the extension**:
   - Click the **"Load unpacked"** button (should be visible after enabling Developer mode)
   - Navigate to the folder where you extracted the extension files
   - Select the folder containing the `manifest.json` file
   - Click **"Select Folder"** (Windows) or **"Open"** (Mac)

2. **Verify installation**:
   - The extension should appear in your extensions list with a green "ON" toggle
   - You should see "Meetup Attendee Status Updater" with version information
   - Look for the extension icon in your browser toolbar (it may be hidden in the extensions menu initially)

### Step 4: Pin the Extension (Recommended)

1. **Make the extension easily accessible**:
   - Click the puzzle piece icon (🧩) in your Chrome toolbar
   - Find "Meetup Attendee Status Updater" in the list
   - Click the pin icon (📌) next to it
   - The extension icon should now appear directly in your toolbar

## Troubleshooting Installation Issues

### Extension Not Loading

**Problem**: Error when clicking "Load unpacked"
**Solutions**:
- Ensure you selected the correct folder (the one containing `manifest.json`)
- Check that all extension files were extracted properly
- Try extracting the ZIP file to a different location

### Extension Not Appearing in Toolbar

**Problem**: Can't find the extension icon
**Solutions**:
- Check the extensions puzzle piece menu (🧩)
- Pin the extension using the pin icon
- Ensure the extension is enabled (green toggle in chrome://extensions/)

### "Developer Mode" Not Available

**Problem**: Cannot find the Developer mode toggle
**Solutions**:
- Make sure you're using a Chromium-based browser (Chrome, Edge, Brave, Opera, etc.)
- Update your browser to the latest version
- Check that you're on the correct extensions page

### Permission Errors

**Problem**: Extension installation blocked or restricted
**Solutions**:
- Check if your organization has Chrome extension policies
- Try installing on a personal computer if on a work/school device
- Contact your IT administrator if on a managed device

## Verifying the Installation

After successful installation, verify everything works:

1. **Check extension status**:
   - Go to `chrome://extensions/`
   - Confirm the extension is enabled and shows no errors

2. **Test basic functionality**:
   - Navigate to any Meetup.com page
   - Click the extension icon
   - The popup should open without errors

3. **Check for updates**:
   - The extension will show the current version number
   - To update, simply repeat the installation process with newer files

## Updating the Extension

To update to a newer version:

1. Download the new version from GitHub (same as Step 1 above)
2. Extract to the same location, replacing old files
3. Go to `chrome://extensions/`
4. Click the refresh/reload icon for the extension
5. Verify the new version number appears

## Uninstalling the Extension

If you need to remove the extension:

1. Go to `chrome://extensions/`
2. Find "Meetup Attendee Status Updater"
3. Click **"Remove"**
4. Confirm the removal
5. You can also delete the extension files from your computer

## Security Notes

- This extension only works on Meetup.com pages
- It requires minimal permissions (active tab and scripting)
- No data is sent to external servers
- All processing happens locally in your browser

## Next Steps

Once installed successfully:
- Read the [Usage Guide](usage-guide.md) for detailed instructions
- Check the [Security & Privacy](security-privacy.md) documentation
- Bookmark the GitHub repository for future updates

## Need Help?

If you're still having trouble:
- Check the [main README](../README.md) for additional information
- [Create an issue](../../issues/new) on GitHub with details about your problem
- Include your Chrome version and operating system in bug reports
