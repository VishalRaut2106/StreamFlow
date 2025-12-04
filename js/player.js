/**
 * Media Player Core
 * Handles local video/audio playback
 */

import { formatTime } from './utils.js';
import { toast } from './toast.js';
import { CONFIG } from './config.js';

export class MediaPlayer {
    constructor(container) {
        this.container = container;
        this.mediaElement = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = CONFIG.DEFAULT_VOLUME;
        this.speed = CONFIG.DEFAULT_SPEED;
        this.isLooping = false;
        this.isMuted = false;
        this.previousVolume = CONFIG.DEFAULT_VOLUME;
        
        this.listeners = new Map();
    }

    /**
     * Load media file
     */
    load(file) {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');
        
        // Clean up existing media
        this.cleanup();
        
        // Create new media element
        this.mediaElement = document.createElement(isVideo ? 'video' : 'audio');
        this.mediaElement.src = url;
        this.mediaElement.volume = this.volume;
        this.mediaElement.loop = this.isLooping;
        this.mediaElement.playbackRate = this.speed;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Add to container
        this.container.innerHTML = '';
        this.container.appendChild(this.mediaElement);
        
        return this.mediaElement;
    }

    /**
     * Setup media event listeners
     */
    setupEventListeners() {
        if (!this.mediaElement) return;

        this.mediaElement.addEventListener('loadedmetadata', () => {
            this.duration = this.mediaElement.duration;
            this.emit('durationchange', this.duration);
        });

        this.mediaElement.addEventListener('timeupdate', () => {
            this.currentTime = this.mediaElement.currentTime;
            this.emit('timeupdate', this.currentTime);
        });

        this.mediaElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.emit('play');
        });

        this.mediaElement.addEventListener('pause', () => {
            this.isPlaying = false;
            this.emit('pause');
        });

        this.mediaElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.emit('ended');
        });

        this.mediaElement.addEventListener('error', (e) => {
            this.emit('error', e);
        });

        this.mediaElement.addEventListener('volumechange', () => {
            this.volume = this.mediaElement.volume;
            this.isMuted = this.mediaElement.muted;
            this.emit('volumechange', this.volume);
        });
    }

    /**
     * Play media
     */
    async play() {
        if (!this.mediaElement) return;
        
        try {
            await this.mediaElement.play();
            return true;
        } catch (err) {
            console.error('Play error:', err);
            toast.error('Failed to play media');
            return false;
        }
    }

    /**
     * Pause media
     */
    pause() {
        if (!this.mediaElement) return;
        this.mediaElement.pause();
    }

    /**
     * Toggle play/pause
     */
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Seek to time
     */
    seek(time) {
        if (!this.mediaElement) return;
        this.mediaElement.currentTime = Math.max(0, Math.min(time, this.duration));
    }

    /**
     * Skip forward
     */
    skipForward(seconds) {
        this.seek(this.currentTime + seconds);
    }

    /**
     * Skip backward
     */
    skipBackward(seconds) {
        this.seek(this.currentTime - seconds);
    }

    /**
     * Set volume
     */
    setVolume(volume) {
        if (!this.mediaElement) return;
        this.volume = Math.max(0, Math.min(1, volume));
        this.mediaElement.volume = this.volume;
    }

    /**
     * Mute/unmute
     */
    toggleMute() {
        if (!this.mediaElement) return;
        
        if (this.isMuted) {
            this.setVolume(this.previousVolume);
            this.isMuted = false;
        } else {
            this.previousVolume = this.volume;
            this.setVolume(0);
            this.isMuted = true;
        }
    }

    /**
     * Set playback speed
     */
    setSpeed(speed) {
        if (!this.mediaElement) return;
        this.speed = Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed));
        this.mediaElement.playbackRate = this.speed;
        this.emit('speedchange', this.speed);
    }

    /**
     * Toggle loop
     */
    toggleLoop() {
        if (!this.mediaElement) return;
        this.isLooping = !this.isLooping;
        this.mediaElement.loop = this.isLooping;
        this.emit('loopchange', this.isLooping);
    }

    /**
     * Request fullscreen
     */
    async requestFullscreen() {
        if (!this.container) return;
        
        try {
            await this.container.requestFullscreen();
            return true;
        } catch (err) {
            console.error('Fullscreen error:', err);
            return false;
        }
    }

    /**
     * Request picture-in-picture
     */
    async requestPiP() {
        if (!this.mediaElement || this.mediaElement.tagName !== 'VIDEO') {
            return false;
        }
        
        try {
            await this.mediaElement.requestPictureInPicture();
            return true;
        } catch (err) {
            console.error('PiP error:', err);
            return false;
        }
    }

    /**
     * Event emitter
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Emit event
     */
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    /**
     * Cleanup
     */
    cleanup() {
        if (this.mediaElement) {
            this.mediaElement.pause();
            this.mediaElement.src = '';
            this.mediaElement.remove();
            this.mediaElement = null;
        }
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
    }

    /**
     * Get current state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            currentTime: this.currentTime,
            duration: this.duration,
            volume: this.volume,
            speed: this.speed,
            isLooping: this.isLooping,
            isMuted: this.isMuted
        };
    }
}
