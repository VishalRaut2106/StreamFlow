# StreamFlow - Modern Media Player

A sleek, modern, feature-rich media player built with vanilla JavaScript, HTML5, and CSS3. No dependencies, no ads, just pure media playback.

![StreamFlow](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Core Functionality
- ✅ **Video & Audio Support** - Play MP4, MKV, AVI, MP3, WAV, and more
- ✅ **YouTube Integration** - Watch YouTube videos directly (with ads as per YouTube TOS)
- ✅ **Drag & Drop** - Drag single or multiple files into the player
- ✅ **File Browser** - Click "Open File" to browse your media
- ✅ **Folder Support** - Load entire folders of media files at once
- ✅ **Play/Pause Control** - Smooth playback controls
- ✅ **Progress Bar** - Seek to any position in your media
- ✅ **Time Display** - Current time and total duration

### Advanced Features
- 🎵 **Playlist Management** - Queue multiple files, sort, clear, and manage
- ⚡ **Playback Speed Control** - 0.25x to 2x speed (8 presets + keyboard shortcuts)
- 🔊 **Volume Control** - Slider with mute/unmute functionality
- 🔁 **Repeat Mode** - Loop your favorite media
- 🎲 **Shuffle Mode** - Random playback order
- 🖥️ **Fullscreen Mode** - Immersive viewing experience
- 📺 **Picture-in-Picture** - Watch while doing other tasks
- 🎧 **Audio Only Mode** - Listen to videos without display (works with YouTube!)
- 🎨 **Audio Visualizer** - Animated bars for YouTube audio mode
- ⏭️ **Previous/Next** - Navigate through your playlist
- ⏪⏩ **Skip Controls** - Jump forward/backward 10 seconds (customizable)
- 🔖 **Bookmarks** - Save and return to specific timestamps
- ⚙️ **Settings** - Customize autoplay, notifications, and skip duration

### User Experience
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 🌙 **Dark Theme** - Easy on the eyes
- ⌨️ **Full Keyboard Control** - 20+ keyboard shortcuts
- 📱 **Responsive Design** - Works on all screen sizes
- 💬 **Toast Notifications** - Visual feedback for all actions
- 💾 **Persistent Settings** - Remembers your preferences
- 🎯 **Jump to Percentage** - Press 0-9 to jump to 0%-90% of video

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `K` | Play/Pause |
| `←` | Rewind 5 seconds |
| `→` | Forward 5 seconds |
| `J` | Rewind 10 seconds (customizable) |
| `L` | Forward 10 seconds (customizable) |
| `↑` | Increase volume |
| `↓` | Decrease volume |
| `M` | Mute/Unmute |
| `F` | Toggle fullscreen |
| `P` | Previous track |
| `N` | Next track |
| `R` | Toggle repeat |
| `S` | Toggle shuffle |
| `Q` | Open playlist |
| `B` | Add bookmark |
| `Shift + >` | Increase speed |
| `Shift + <` | Decrease speed |
| `0-9` | Jump to 0%-90% |
| `?` | Show keyboard shortcuts |

## Design

### Color Scheme
- **Primary Gradient**: Purple to Blue (#667eea → #764ba2)
- **Background**: Dark theme (#1a1a2e, #16161e)
- **Accent**: Purple (#667eea)

### Typography
- Font: Segoe UI (system font)
- Modern, clean, and readable

## Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## How to Use

1. **Open Media**
   - Click "Open File" to select a single file
   - Click "Open Folder" to load all media from a folder
   - Click "YouTube" button and paste any YouTube URL
   - Drag & drop files or folders directly into the player

2. **YouTube Videos**
   - Click the YouTube button in the header
   - Paste any YouTube URL (full URL or video ID)
   - Supported formats:
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - `VIDEO_ID` (just the ID)
   - Note: YouTube ads will be shown as per YouTube's Terms of Service

3. **Playback Controls**
   - Use the play/pause button or press `Space`/`K`
   - Seek by clicking on the progress bar
   - Skip forward/backward with `J` and `L` keys

4. **Playlist Management**
   - Press `Q` to view playlist
   - Click any item to play it
   - Remove items with the X button
   - Sort or clear playlist with toolbar buttons

5. **Advanced Features**
   - Press `?` to see all keyboard shortcuts
   - Click the headphones icon for audio-only mode
   - Right-click bookmark button to view saved bookmarks
   - Click settings icon to customize behavior

5. **Quick Tips**
   - Press `0-9` to jump to any percentage of the video
   - Use `Shift + >` or `<` to adjust playback speed
   - Press `B` to bookmark current position
   - Enable autoplay in settings for continuous playback

## File Structure
```
streamflow/
├── index.html      # Main HTML structure
├── style.css       # All styling and animations
├── script.js       # Media player logic
└── README.md       # This file
```

## Bug Fixes & Improvements

### Fixed Issues:
- ✅ HTML formatting errors with button tags
- ✅ Progress bar edge cases with NaN values
- ✅ Fullscreen icon not updating on exit
- ✅ Audio-only mode timing issues
- ✅ Playlist navigation with single item
- ✅ Media error handling
- ✅ Autoplay promise rejection handling
- ✅ Volume slider validation

### Layout Improvements:
- ✅ Bigger video window (98% of container)
- ✅ Compact header (60px height)
- ✅ Optimized controls panel (120px height)
- ✅ Better responsive design for mobile
- ✅ Hidden button labels on tablets
- ✅ Improved spacing and margins

## Known Limitations

- YouTube videos will show ads as required by YouTube's Terms of Service
- YouTube playback speed control is limited by YouTube's API
- Some browsers may block autoplay (user interaction required)
- Picture-in-Picture for YouTube requires browser support
- Folder selection uses webkitdirectory (Chrome/Edge recommended)

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ Full | Recommended |
| Firefox | ✅ Full | All features work |
| Safari | ⚠️ Partial | PiP may vary |
| Opera | ✅ Full | All features work |

## Future Enhancements
- [ ] Equalizer with presets
- [ ] Subtitle support (.srt, .vtt files)
- [ ] Media library/database
- [ ] Theme customization (colors)
- [ ] Playlist save/load to file
- [ ] Audio visualization
- [ ] Chromecast support
- [ ] Video filters and effects
- [ ] Chapter markers
- [ ] Sleep timer with countdown

## Contributing

Feel free to fork, improve, and submit pull requests!

## License

MIT License - Free to use and modify

---

**StreamFlow** - Your modern media companion 🎵

Made with ❤️ using vanilla JavaScript
# StreamFlow
