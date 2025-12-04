/**
 * StreamFlow Configuration
 * Central configuration for the media player
 */

export const CONFIG = {
    // Player settings
    DEFAULT_VOLUME: 0.7,
    DEFAULT_SKIP_DURATION: 10,
    DEFAULT_SPEED: 1.0,
    
    // Speed presets
    SPEED_OPTIONS: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    MIN_SPEED: 0.25,
    MAX_SPEED: 2.0,
    SPEED_STEP: 0.25,
    
    // Volume settings
    MIN_VOLUME: 0,
    MAX_VOLUME: 1,
    VOLUME_STEP: 0.1,
    
    // UI settings
    TOAST_DURATION: 2000,
    PROGRESS_UPDATE_INTERVAL: 500,
    VISUALIZATION_UPDATE_INTERVAL: 150,
    
    // Storage keys
    STORAGE_KEYS: {
        SETTINGS: 'streamflow_settings',
        BOOKMARKS: 'streamflow_bookmarks',
        RECENT_FILES: 'streamflow_recent',
        THEME: 'streamflow_theme'
    },
    
    // Supported formats
    SUPPORTED_VIDEO_FORMATS: ['mp4', 'mkv', 'avi', 'webm', 'mov', 'flv', 'ogv'],
    SUPPORTED_AUDIO_FORMATS: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'],
    
    // YouTube settings
    YOUTUBE: {
        ERROR_CODES: {
            INVALID_ID: 2,
            HTML5_ERROR: 5,
            NOT_FOUND: 100,
            EMBED_DISABLED: 101,
            EMBED_RESTRICTED: 150
        }
    },
    
    // Keyboard shortcuts
    SHORTCUTS: {
        PLAY_PAUSE: ['Space', 'KeyK'],
        REWIND_5: 'ArrowLeft',
        FORWARD_5: 'ArrowRight',
        REWIND_10: 'KeyJ',
        FORWARD_10: 'KeyL',
        VOLUME_UP: 'ArrowUp',
        VOLUME_DOWN: 'ArrowDown',
        MUTE: 'KeyM',
        FULLSCREEN: 'KeyF',
        PREVIOUS: 'KeyP',
        NEXT: 'KeyN',
        REPEAT: 'KeyR',
        SHUFFLE: 'KeyS',
        PLAYLIST: 'KeyQ',
        BOOKMARK: 'KeyB',
        HELP: 'Slash'
    }
};

// Feature flags
export const FEATURES = {
    ENABLE_YOUTUBE: true,
    ENABLE_BOOKMARKS: true,
    ENABLE_PLAYLIST: true,
    ENABLE_AUDIO_ONLY: true,
    ENABLE_PIP: true,
    ENABLE_VISUALIZER: true,
    ENABLE_KEYBOARD_SHORTCUTS: true
};

// App metadata
export const APP_INFO = {
    NAME: 'StreamFlow',
    VERSION: '1.1.1',
    AUTHOR: 'StreamFlow Team',
    DESCRIPTION: 'Modern Media Player with YouTube Integration',
    GITHUB: 'https://github.com/streamflow/streamflow',
    LICENSE: 'MIT'
};
