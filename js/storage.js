/**
 * Storage Manager
 * Handles localStorage operations for settings, bookmarks, etc.
 */

import { CONFIG } from './config.js';

class StorageManager {
    constructor() {
        this.isAvailable = this.checkAvailability();
    }

    /**
     * Check if localStorage is available
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return false;
        }
    }

    /**
     * Get item from storage
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;
        
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from storage:', e);
            return defaultValue;
        }
    }

    /**
     * Set item in storage
     */
    set(key, value) {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to storage:', e);
            return false;
        }
    }

    /**
     * Remove item from storage
     */
    remove(key) {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from storage:', e);
            return false;
        }
    }

    /**
     * Clear all storage
     */
    clear() {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }

    /**
     * Get settings
     */
    getSettings() {
        return this.get(CONFIG.STORAGE_KEYS.SETTINGS, {
            volume: CONFIG.DEFAULT_VOLUME,
            skipDuration: CONFIG.DEFAULT_SKIP_DURATION,
            autoplayNext: false,
            showNotifications: true,
            rememberVolume: true
        });
    }

    /**
     * Save settings
     */
    saveSettings(settings) {
        return this.set(CONFIG.STORAGE_KEYS.SETTINGS, settings);
    }

    /**
     * Get bookmarks
     */
    getBookmarks() {
        return this.get(CONFIG.STORAGE_KEYS.BOOKMARKS, []);
    }

    /**
     * Save bookmarks
     */
    saveBookmarks(bookmarks) {
        return this.set(CONFIG.STORAGE_KEYS.BOOKMARKS, bookmarks);
    }

    /**
     * Add bookmark
     */
    addBookmark(bookmark) {
        const bookmarks = this.getBookmarks();
        bookmarks.push({
            ...bookmark,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });
        return this.saveBookmarks(bookmarks);
    }

    /**
     * Remove bookmark
     */
    removeBookmark(id) {
        const bookmarks = this.getBookmarks();
        const filtered = bookmarks.filter(b => b.id !== id);
        return this.saveBookmarks(filtered);
    }

    /**
     * Get recent files
     */
    getRecentFiles() {
        return this.get(CONFIG.STORAGE_KEYS.RECENT_FILES, []);
    }

    /**
     * Add recent file
     */
    addRecentFile(file) {
        const recent = this.getRecentFiles();
        const fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            timestamp: new Date().toISOString()
        };
        
        // Remove duplicates
        const filtered = recent.filter(f => f.name !== file.name);
        
        // Add to beginning and limit to 10
        filtered.unshift(fileInfo);
        const limited = filtered.slice(0, 10);
        
        return this.set(CONFIG.STORAGE_KEYS.RECENT_FILES, limited);
    }

    /**
     * Clear recent files
     */
    clearRecentFiles() {
        return this.set(CONFIG.STORAGE_KEYS.RECENT_FILES, []);
    }
}

// Export singleton instance
export const storage = new StorageManager();
