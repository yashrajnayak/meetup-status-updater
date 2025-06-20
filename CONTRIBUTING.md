# Contributing to Meetup Attendee Status Updater

Thank you for your interest in contributing! This extension is open source and welcomes contributions from the community.

## Ways to Contribute

- 🐛 **Report bugs** and issues
- 💡 **Suggest new features** or improvements
- 📖 **Improve documentation** and guides
- 🔧 **Submit code fixes** and enhancements
- 🧪 **Test the extension** on different systems
- 🌐 **Help with browser compatibility**

## Getting Started

### Prerequisites

- **Google Chrome** (latest version recommended)
- **Basic web development knowledge** (HTML, CSS, JavaScript)
- **Git** for version control
- **Text editor** or IDE of your choice

### Setting Up for Development

1. **Fork the repository**:
   - Click the "Fork" button on the GitHub repository page
   - Clone your fork to your local machine:
   ```bash
   git clone https://github.com/your-username/meetup-status-updater.git
   cd meetup-status-updater
   ```

2. **Load the extension for development**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the repository folder
   - The extension is now loaded for testing

3. **Make your changes**:
   - Edit the relevant files (see [Project Structure](#project-structure))
   - Test your changes thoroughly
   - Ensure the extension still works as expected

4. **Test on Meetup.com**:
   - Create or find a test Meetup event with attendees
   - Verify your changes work correctly
   - Test both past and future meetup modes

## Project Structure

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

### Key Files

- **`manifest.json`**: Extension configuration, permissions, and metadata
- **`popup.html/popup.js`**: User interface and settings management
- **`content.js`**: Core functionality that interacts with Meetup pages
- **`docs/`**: User-facing documentation and guides

## Reporting Issues

### Before Reporting

1. **Check existing issues**: Search to see if the problem is already reported
2. **Test thoroughly**: Ensure you can reproduce the issue consistently
3. **Gather information**: Note your browser version, OS, and exact steps

### Creating a Good Issue Report

Include the following information:

- **Clear title**: Briefly describe the problem
- **Detailed description**: What happened vs. what you expected
- **Steps to reproduce**: Exact steps to recreate the issue
- **Environment details**:
  - Chrome version
  - Operating system
  - Extension version
  - Meetup event URL (if relevant)
- **Screenshots**: If applicable, include visual evidence
- **Console errors**: Check browser console (F12) for error messages

### Issue Types

**Bug Reports**: Something isn't working correctly
- Use the "Bug" label
- Include reproduction steps
- Mention if this is a regression

**Feature Requests**: New functionality or improvements
- Use the "Enhancement" label
- Explain the use case and benefits
- Consider implementation complexity

**Documentation**: Improvements to guides and docs
- Use the "Documentation" label
- Specify which documentation needs improvement
- Suggest specific changes

## Contributing Code

### Development Guidelines

1. **Follow existing code style**:
   - Use consistent indentation (2 spaces)
   - Add comments for complex logic
   - Use meaningful variable names
   - Keep functions focused and small

2. **Test thoroughly**:
   - Test on multiple Meetup events
   - Verify both past and future meetup modes
   - Test name filtering functionality
   - Check error handling

3. **Maintain backwards compatibility**:
   - Don't break existing functionality
   - Consider migration for settings changes
   - Document any breaking changes

### Code Quality Standards

- **JavaScript best practices**: Use modern ES6+ features appropriately
- **Error handling**: Gracefully handle failures and edge cases
- **Performance**: Avoid blocking operations and excessive API calls
- **Security**: Follow Chrome extension security guidelines
- **Accessibility**: Ensure UI elements are accessible

### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Implement your feature or fix
   - Add or update tests if applicable
   - Update documentation as needed

3. **Test thoroughly**:
   - Load the extension in Chrome
   - Test on real Meetup events
   - Verify all existing functionality still works

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add feature: brief description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template

### Pull Request Guidelines

**Title**: Clear, concise description of the change
**Description**: Include:
- What the PR does
- Why the change is needed
- How to test the changes
- Any breaking changes or considerations

**Checklist**:
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tested on actual Meetup events
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or clearly documented)

## Testing Guidelines

### Manual Testing

1. **Basic functionality**:
   - Extension loads without errors
   - Popup opens and displays correctly
   - Settings are saved and loaded properly

2. **Core features**:
   - Past meetup mode updates to "Went"
   - Future meetup mode updates to "Going"
   - Name filtering works correctly
   - Progress tracking is accurate

3. **Edge cases**:
   - Large events (100+ attendees)
   - Events with no attendees
   - Name filters with special characters
   - Network interruptions

4. **Error handling**:
   - Invalid Meetup pages
   - Missing permissions
   - Page navigation during processing

### Browser Testing

Test on:
- **Chrome** (primary target)
- **Different versions** if possible
- **Different operating systems** (Windows, macOS, Linux)

## Documentation Guidelines

### Writing Style

- **Clear and concise**: Use simple language
- **User-focused**: Write from the user's perspective
- **Step-by-step**: Break complex processes into steps
- **Visual aids**: Include screenshots where helpful

### Documentation Types

- **User guides**: How to use features
- **Technical docs**: Code structure and APIs
- **Troubleshooting**: Common problems and solutions
- **Examples**: Real-world usage scenarios

### Updating Documentation

When making changes, also update:
- README.md (if user-facing changes)
- Relevant files in docs/ folder
- Code comments
- CHANGELOG.md for releases

## Code of Conduct

### Our Standards

- **Be respectful**: Treat all contributors with respect
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different skill levels
- **Be inclusive**: Welcome contributors from all backgrounds

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Offensive language or imagery
- Personal attacks or insults
- Spam or off-topic discussions

### Enforcement

Project maintainers have the right to remove comments, commits, or contributions that don't align with this Code of Conduct.

## Getting Help

### Development Questions

- **GitHub Issues**: For specific problems or questions
- **Code Review**: Discuss implementation approaches in PRs
- **Documentation**: Check existing docs first

### Best Practices

- **Start small**: Begin with minor fixes or documentation improvements
- **Ask questions**: Don't hesitate to ask for clarification
- **Learn from feedback**: Use code review comments to improve
- **Be patient**: Code review and testing take time

## Recognition

Contributors will be recognized in:
- **README.md**: Major contributors listed
- **CHANGELOG.md**: Credits for specific features
- **GitHub**: Contribution history and statistics

## Release Process

1. **Version numbering**: Follow semantic versioning (MAJOR.MINOR.PATCH)
2. **Changelog**: Update CHANGELOG.md with new features and fixes
3. **Testing**: Comprehensive testing before release
4. **Documentation**: Ensure docs are up to date
5. **GitHub release**: Create release with notes and assets

## Future Roadmap

Potential areas for contribution:

- **Enhanced filtering**: More sophisticated name matching
- **Batch operations**: Process multiple events at once
- **Statistics**: Track success rates and performance
- **UI improvements**: Better user interface and experience
- **Error recovery**: More robust error handling
- **Browser support**: Extend to Firefox and other browsers

Thank you for contributing to making this extension better for everyone! 🎉
