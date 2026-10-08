# Language Translation Tool

A modern, responsive web-based language translation tool built with vanilla JavaScript. Translate text between multiple languages instantly with features like text-to-speech, translation history, and copy-to-clipboard functionality.

## Features

- **Multi-language Support** - Translate between 12 languages (English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi)
- **Real-time Translation** - Instant translation using MyMemory Translation API
- **Text-to-Speech** - Listen to translations with built-in audio playback
- **Translation History** - Automatically saves your last 10 translations
- **Copy to Clipboard** - One-click copy of translated text
- **Language Swap** - Quickly swap source and target languages
- **Character Counter** - Track input length (max 5000 characters)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling** - Clear error messages for network issues or API failures
- **Loading States** - Visual feedback during translation requests

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Translation API**: MyMemory Translation API (free, no authentication required)
- **Text-to-Speech**: Web Speech API (browser built-in)
- **Storage**: LocalStorage for translation history
- **Styling**: Custom CSS with gradient design and responsive layout

## Setup Instructions

1. **Clone or download** this project
2. **Open** `index.html` in any modern web browser
3. **Start translating** - no installation or configuration needed!

### Alternative: Local Server

For testing with a local server:

```bash
# Navigate to project directory
cd Language-Translation-Tool

# Start a simple HTTP server (Python)
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

## Usage Guide

1. **Select Languages**: Choose source and target languages from the dropdown menus
2. **Enter Text**: Type or paste text (up to 5000 characters) in the input area
3. **Translate**: Click the "Translate" button or press `Ctrl+Enter`
4. **Copy Translation**: Click the clipboard icon to copy the result
5. **Listen**: Click the speaker icon for text-to-speech playback
6. **View History**: Previous translations appear below automatically
7. **Reuse History**: Click any history item to reload it

### Keyboard Shortcuts

- `Ctrl + Enter` - Translate text
- Click swap button (⇄) - Exchange source and target languages

## Project Structure

```
Language-Translation-Tool/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # Translation logic and API integration
└── README.md           # Project documentation
```

## API Information

This project uses the **MyMemory Translation API**, which provides:
- Free access without API keys
- 10,000 characters per day limit
- Support for 50+ language pairs
- Fast response times

**API Endpoint**: `https://api.mymemory.translated.net/get`

## Browser Compatibility

- **Chrome/Edge**: ✓ Full support
- **Firefox**: ✓ Full support
- **Safari**: ✓ Full support (text-to-speech may vary)
- **Mobile Browsers**: ✓ Responsive design optimized

**Note**: Text-to-speech availability depends on browser support for the Web Speech API.

## Screenshots

### Desktop View
![Desktop Interface](screenshot-desktop.png)

### Mobile View
![Mobile Interface](screenshot-mobile.png)

## Future Enhancements

- Language auto-detection
- Offline translation support
- Export translation history
- Dark mode toggle
- Additional language support
- Pronunciation guide

## Limitations

- Daily translation limit: 10,000 characters (API restriction)
- Translation quality depends on MyMemory API database
- Text-to-speech voices vary by browser and operating system
- Requires internet connection for translation

## License

This project is open source and available for educational purposes.

## Acknowledgments

- Translation powered by [MyMemory Translation API](https://mymemory.translated.net/)
- Text-to-speech powered by Web Speech API
- Developed as part of CodeAlpha AI/ML Internship

---

**Developed by**: [Your Name]  
**Project**: CodeAlpha AI/ML Virtual Internship - Task 1  
**Date**: October 2026
