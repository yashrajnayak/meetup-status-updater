# Changelog

All notable changes to the Meetup Attendee Status Updater extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation package
- Detailed installation guide for GitHub distribution
- Step-by-step usage guide with troubleshooting
- Security and privacy documentation
- Contributing guidelines for open source development

### Changed
- Updated README.md for GitHub repository distribution
- Improved documentation structure and organization

## [1.0.0] - 2024-XX-XX

### Added
- Initial release of Meetup Attendee Status Updater
- Support for both past and future meetup events
- Intelligent name filtering with flexible matching
- Smart batch processing with duplicate prevention
- Auto tab recovery for Meetup's tab switching behavior
- Real-time progress tracking with visual indicators
- Configurable delays for actions and scrolling
- Automatic error recovery and handling
- Chrome Extension Manifest V3 compliance

### Features
- **Dual Mode Support**: 
  - Past meetups: Move attendees to "Went" status
  - Future meetups: Move attendees to "Going" status
- **Name Filtering**: 
  - Case-insensitive matching
  - Partial name matching
  - Process specific attendees only
- **Batch Processing**: 
  - Efficient attendee processing
  - Duplicate tracking and prevention
  - Progress monitoring
- **Auto-Recovery**: 
  - Handle Meetup page navigation
  - Recover from dropdown state changes
  - Automatic tab switching detection
- **User Interface**: 
  - Intuitive popup interface
  - Real-time progress updates
  - Configurable settings
  - Start/stop controls

### Technical Details
- Chrome Extension Manifest V3
- Content script injection for Meetup.com
- Background communication between popup and content script
- Local storage for user preferences
- Robust DOM element selection
- Error handling and user feedback

### Browser Support
- Chromium-based browsers (version 88+)
- Chrome, Edge, Brave, Opera, Vivaldi, Arc, and others

### Permissions
- `activeTab`: Access current Meetup tab
- `scripting`: Interact with page elements
- `storage`: Save user preferences
- `host_permissions`: Access to Meetup.com only

---

## Version History Notes

### Version Numbering
This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Incompatible API changes or major functionality changes
- **MINOR**: New features added in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

### Change Categories
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Features removed in this version
- **Fixed**: Bug fixes
- **Security**: Security improvements

### Release Process
1. Update version number in `manifest.json`
2. Update this CHANGELOG.md with new changes
3. Create GitHub release with notes
4. Test thoroughly before publishing

### Contributing
When contributing changes, please:
1. Add your changes to the [Unreleased] section
2. Follow the established format
3. Include both user-facing and technical changes
4. Reference issue numbers when applicable

### Support
For questions about version history or releases:
- Check the [GitHub releases page](../../releases)
- Review [closed issues](../../issues?q=is%3Aissue+is%3Aclosed) for detailed change context
- Create a new issue for clarification
