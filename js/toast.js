/**
 * Toast Notification System
 * Displays temporary notifications to the user
 */

import { CONFIG } from './config.js';

class ToastManager {
    constructor() {
        this.toastElement = document.getElementById('toast');
        this.queue = [];
        this.isShowing = false;
        this.enabled = true;
    }

    /**
     * Show a toast message
     */
    show(message, duration = CONFIG.TOAST_DURATION) {
        if (!this.enabled || !this.toastElement) return;

        this.queue.push({ message, duration });
        
        if (!this.isShowing) {
            this.showNext();
        }
    }

    /**
     * Show next toast in queue
     */
    showNext() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const { message, duration } = this.queue.shift();

        this.toastElement.textContent = message;
        this.toastElement.style.display = 'block';
        this.toastElement.classList.add('show');

        setTimeout(() => {
            this.toastElement.classList.remove('show');
            setTimeout(() => {
                this.toastElement.style.display = 'none';
                this.showNext();
            }, 300);
        }, duration);
    }

    /**
     * Show success message
     */
    success(message) {
        this.show(`✓ ${message}`);
    }

    /**
     * Show error message
     */
    error(message) {
        this.show(`✗ ${message}`);
    }

    /**
     * Show info message
     */
    info(message) {
        this.show(`ℹ ${message}`);
    }

    /**
     * Show warning message
     */
    warning(message) {
        this.show(`⚠ ${message}`);
    }

    /**
     * Enable/disable toasts
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Clear queue
     */
    clearQueue() {
        this.queue = [];
    }
}

// Export singleton instance
export const toast = new ToastManager();
