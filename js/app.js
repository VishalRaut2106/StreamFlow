/**
 * StreamFlow Main Application
 * Entry point and application orchestrator
 */

import { CONFIG, FEATURES, APP_INFO } from './config.js';
import { MediaPlayer } from './player.js';
import { storage } from './storage.js';
import { toast } from './toast.js';
import { formatTime, extractYouTubeID, isMediaFile } from './utils.js';

class StreamFlowApp {
    constructor() {
        this.player = null;
        this.youtubePlayer = null;
        this.isYouTubeMode = false;
        this.playlist = [];
        this.currentIndex = -1;
        this.settings = storage.getSettings();
        
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        console.log(`${APP_INFO.NAME} v${APP_INFO.VERSION} - Initializing...`);
        
        // Initialize player
        const container = document.getElementById('playerContainer');
        this.player = new MediaPlayer(container);
        
        // Load settings
        this.loadSettings();
        
        // Setup UI event listeners
        this.setupUI();
        
        // Setup keyboard shortcuts
        if (FEATURES.ENABLE_KEYBOARD_SHORTCUTS) {
            this.setupKeyboardShortcuts();
        }
        
        // Show welcome message
        this.showWelcome();
        
        console.log(`${APP_INFO.NAME} ready!`);
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        this.settings = storage.getSettings();
        
        // Apply settings
        if (this.settings.volume !== undefined) {
            this.player.setVolume(this.settings.volume);
        }
        
        toast.setEnabled(this.settings.showNotifications);
    }

    /**
     * Setup UI event listeners
     */
    setupUI() {
        // File input
        const openFileBtn = document.getElementById('openFileBtn');
        const fileInput = document.getElementById('fileInput');
        
        openFileBtn?.addEventListener('click', () => fileInput.click());
        fileInput?.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Folder input
        const openFolderBtn = document.getElementById('openFolderBtn');
        const folderInput = document.getElementById('folderInput');
        
        openFolderBtn?.addEventListener('click', () => folderInput.click());
        folderInput?.addEventListener('change', (e) => this.handleFolderSelect(e));
        
        // Drag and drop
        const playerContainer = document.getElementById('playerContainer');
        this.setupDragAndDrop(playerContainer);
        
        // Play/pause button
        const playPauseBtn = document.getElementById('playPauseBtn');
        playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        
        // Volume controls
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeBtn = document.getElementById('volumeBtn');
        
        volumeSlider?.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.player.setVolume(volume);
            this.updateVolumeIcon(volume);
        });
        
        volumeBtn?.addEventListener('click', () => {
            this.player.toggleMute();
            this.updateVolumeIcon(this.player.volume);
        });
        
        // Progress bar
        const progressBar = document.getElementById('progressBar');
        progressBar?.addEventListener('input', (e) => {
            this.player.seek(parseFloat(e.target.value));
        });
        
        // Player events
        this.player.on('timeupdate', (time) => this.updateProgress(time));
        this.player.on('durationchange', (duration) => this.updateDuration(duration));
        this.player.on('play', () => this.updatePlayPauseButton());
        this.player.on('pause', () => this.updatePlayPauseButton());
        this.player.on('ended', () => this.handleMediaEnded());
    }

    /**
     * Setup drag and drop
     */
    setupDragAndDrop(element) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });
        
        element.addEventListener('dragleave', () => {
            element.classList.remove('drag-over');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files).filter(isMediaFile);
            if (files.length > 0) {
                this.loadFiles(files);
            }
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            this.handleKeyboardShortcut(e);
        });
    }

    /**
     * Handle keyboard shortcut
     */
    handleKeyboardShortcut(e) {
        const shortcuts = CONFIG.SHORTCUTS;
        
        // Play/Pause
        if (shortcuts.PLAY_PAUSE.includes(e.code)) {
            e.preventDefault();
            this.togglePlayPause();
        }
        // Volume
        else if (e.code === shortcuts.VOLUME_UP) {
            e.preventDefault();
            this.adjustVolume(0.1);
        }
        else if (e.code === shortcuts.VOLUME_DOWN) {
            e.preventDefault();
            this.adjustVolume(-0.1);
        }
        // Seeking
        else if (e.code === shor