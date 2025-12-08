# 🦕 Glosaurus

A modern desktop glossary management application built with Tauri, Preact, and TypeScript.

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## ✨ Features

- 📚 **Multi-Glossary Management** - Organize words into themed glossaries
- 📝 **Word Definitions** - Add words with detailed definitions and synonyms
- 🤖 **AI Synonym Suggestions** - Get intelligent synonym recommendations
- 💾 **Import/Export** - Support for JSON and Markdown (table format) with preview buttons
- 🔍 **Search & Filter** - Quickly find glossaries and words
- 🎨 **Modern UI** - Clean and intuitive interface
- 🚀 **Fast & Native** - Built with Tauri for optimal performance

## 📦 Download & Installation

### Quick Download

**Latest Release:** [v1.0.1](https://github.com/Embedding-Groupe/Application-Glossaire/releases/latest)

**Choose your platform:**

| Platform | Download |
|----------|----------|
| 🪟 Windows | [Setup.exe](https://github.com/Embedding-Groupe/Application-Glossaire/releases/latest) \| [MSI Installer](https://github.com/Embedding-Groupe/Application-Glossaire/releases/latest) |
| 🍎 macOS (Apple Silicon) | [DMG](https://github.com/Embedding-Groupe/Application-Glossaire/releases/latest) |
| Linux | [DEB](https://github.com/Embedding-Groupe/Application-Glossaire/releases/latest) |

### Detailed Installation Instructions

Please see the latest release note for complete installation instructions for your platform.

## 🚀 Quick Start

1. **Create a Glossary**
   - Click "Create New Glossary"
   - Enter name and description

2. **Add Words**
   - Open your glossary
   - Click "Add New Word"
   - Fill in word, definition, and synonyms

3. **Use AI Suggestions**
   - While adding a word, AI will suggest synonyms
   - Click any suggestion to add it instantly

4. **Export & Share**
   - Click "Export" button
   - Choose JSON or Markdown format (preview can be display)
   - Save and share your glossary

## 📝 File Formats

### Markdown (Table Format)
```markdown
# My Glossary
### Description

| Word | Definition | Synonyms |
| --- | --- | --- |
| Example | A representative form | sample, illustration |
```

### JSON Format
```json
{
  "name": "My Glossary",
  "description": "Description",
  "words": [
    {
      "word": "Example",
      "definition": "A representative form",
      "synonyms": ["sample", "illustration"]
    }
  ]
}
```

## 🛠️ Development

### Prerequisites
- Node.js (LTS)
- Rust
- Platform-specific dependencies (see below)

### Platform Dependencies

**Windows:**
- Visual Studio Build Tools

**macOS:**
- Xcode Command Line Tools

**Linux:**
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.0-dev \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf
```

### Setup & Run

```bash
# Clone the repository
git clone https://github.com/Embedding-Groupe/Application-Glossaire.git
cd Glosaurus

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI framework: [Preact](https://preactjs.com/)
- Icons: [Lucide](https://lucide.dev/)
- Build tool: [Vite](https://vitejs.dev/)

## 📧 Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/Embedding-Groupe/Application-Glossaire/issues) page.

---

**Made with ❤️ by Embedding-Groupe**
