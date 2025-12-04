// DOM Elements
const fileInput = document.getElementById('fileInput');
const folderInput = document.getElementById('folderInput');
const openFileBtn = document.getElementById('openFileBtn');
const openFolderBtn = document.getElementById('openFolderBtn');
const playerContainer = document.getElementById('playerContainer');
const dropZone = document.getElementById('dropZone');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const speedBtn = document.getElementById('speedBtn');
const speedModal = document.getElementById('speedModal');
const repeatBtn = document.getElementById('repeatBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const playlistBtn = document.getElementById('playlistBtn');
const playlistModal = document.getElementById('playlistModal');
const closePlaylist = document.getElementById('closePlaylist');
const playlistItems = document.getElementById('playlistItems');
const mediaInfo = document.getElementById('mediaInfo');
const toast = document.getElementById('toast');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const rewind10Btn = document.getElementById('rewind10Btn');
const forward10Btn = document.getElementById('forward10Btn');
const audioOnlyBtn = document.getElementById('audioOnlyBtn');
// const pipBtn = document.getElementById('pipBtn'); // Removed for cleaner UI
// Bookmark functionality removed for cleaner UI
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const shortcutsHelp = document.getElementById('shortcutsHelp');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
const sortPlaylistBtn = document.getElementById('sortPlaylistBtn');
const youtubeBtn = document.getElementById('youtubeBtn');
const youtubeModal = document.getElementById('youtubeModal');
const closeYoutube = document.getElementById('closeYoutube');
const youtubeUrlInput = document.getElementById('youtubeUrlInput');
const loadYoutubeBtn = document.getElementById('loadYoutubeBtn');

// State
let mediaElement = null;
let isPlaying = false;
let currentVolume = 0.7;
let previousVolume = 0.7;
let isMuted = false;
let isRepeating = false;
let currentSpeed = 1;
let playlist = [];
let currentPlaylistIndex = -1;
let isShuffled = false;
let shuffledPlaylist = [];
let isAudioOnly = false;
// let bookmarks = []; // Removed for cleaner UI
let skipDuration = 10;
let autoplayNext = false;
let showNotifications = true;
let youtubePlayer = null;
let isYouTubeMode = false;
let youtubeUpdateInterval = null;

// Initialize
volumeSlider.value = currentVolume * 100;
loadSettings();
// loadBookmarks(); // Removed

// File Input Handler
openFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        loadMedia(file);
    }
});

// Folder Input Handler
openFolderBtn.addEventListener('click', () => {
    folderInput.click();
});

folderInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    const mediaFiles = files.filter(file => 
        file.type.startsWith('video/') || file.type.startsWith('audio/')
    );
    
    if (mediaFiles.length > 0) {
        loadMultipleFiles(mediaFiles);
        showToast(`Loaded ${mediaFiles.length} files`);
    } else {
        showToast('No media files found in folder');
    }
});

// Drag and Drop
playerContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (dropZone) dropZone.classList.add('drag-over');
});

playerContainer.addEventListener('dragleave', () => {
    if (dropZone) dropZone.classList.remove('drag-over');
});

playerContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    if (dropZone) dropZone.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    const mediaFiles = files.filter(file => 
        file.type.startsWith('video/') || file.type.startsWith('audio/')
    );
    
    if (mediaFiles.length > 1) {
        loadMultipleFiles(mediaFiles);
        showToast(`Loaded ${mediaFiles.length} files`);
    } else if (mediaFiles.length === 1) {
        loadMedia(mediaFiles[0]);
    } else {
        showToast('Please drop valid media files');
    }
});

// Load Media Function
function loadMedia(file) {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');
    
    // Exit YouTube mode
    if (isYouTubeMode) {
        if (youtubePlayer) {
            youtubePlayer.destroy();
            youtubePlayer = null;
        }
        if (youtubeUpdateInterval) {
            clearInterval(youtubeUpdateInterval);
            youtubeUpdateInterval = null;
        }
        isYouTubeMode = false;
        playerContainer.classList.remove('youtube-active');
    }
    
    // Remove existing media
    if (mediaElement) {
        mediaElement.remove();
    }
    
    // Create new media element
    mediaElement = document.createElement(isVideo ? 'video' : 'audio');
    mediaElement.src = url;
    mediaElement.volume = currentVolume;
    mediaElement.loop = isRepeating;
    mediaElement.playbackRate = currentSpeed;
    
    // Clear drop zone and add media
    playerContainer.innerHTML = '';
    
    if (isAudioOnly && isVideo) {
        // Audio only mode for videos
        const audioIndicator = document.createElement('div');
        audioIndicator.className = 'audio-only-indicator';
        audioIndicator.innerHTML = `
            <i class="fas fa-headphones"></i>
            <h2>Audio Only Mode</h2>
            <p>${file.name}</p>
        `;
        playerContainer.appendChild(audioIndicator);
        playerContainer.classList.add('audio-only-mode');
    } else {
        playerContainer.classList.remove('audio-only-mode');
    }
    
    playerContainer.appendChild(mediaElement);
    
    // Update media info
    mediaInfo.innerHTML = `<span class="media-title">${file.name}</span>`;
    
    // Add to playlist
    addToPlaylist(file, url);
    
    // Setup event listeners
    setupMediaListeners();
    
    // Auto play
    mediaElement.play().catch(err => {
        console.log('Autoplay prevented:', err);
        isPlaying = false;
        updatePlayPauseButton();
    });
    isPlaying = true;
    updatePlayPauseButton();
    
    if (showNotifications) {
        showToast('Media loaded successfully');
    }
}

// Load Multiple Files
function loadMultipleFiles(files) {
    playlist = [];
    files.forEach(file => {
        const url = URL.createObjectURL(file);
        playlist.push({ name: file.name, url: url, file: file });
    });
    
    if (isShuffled) {
        shufflePlaylist();
    }
    
    currentPlaylistIndex = 0;
    loadMedia(files[0]);
    updatePlaylistCount();
}

// Setup Media Event Listeners
function setupMediaListeners() {
    mediaElement.addEventListener('loadedmetadata', () => {
        if (mediaElement.duration && !isNaN(mediaElement.duration) && isFinite(mediaElement.duration)) {
            totalTimeDisplay.textContent = formatTime(mediaElement.duration);
            progressBar.max = mediaElement.duration;
        } else {
            totalTimeDisplay.textContent = '--:--';
            progressBar.max = 100;
        }
    });
    
    mediaElement.addEventListener('timeupdate', () => {
        if (mediaElement.currentTime && !isNaN(mediaElement.currentTime)) {
            currentTimeDisplay.textContent = formatTime(mediaElement.currentTime);
            progressBar.value = mediaElement.currentTime;
            if (mediaElement.duration && !isNaN(mediaElement.duration) && mediaElement.duration > 0) {
                const percentage = (mediaElement.currentTime / mediaElement.duration) * 100;
                progressFill.style.width = percentage + '%';
            }
        }
    });
    
    mediaElement.addEventListener('ended', () => {
        if (!isRepeating && (autoplayNext || playlist.length > 1)) {
            playNext();
        } else if (!isRepeating) {
            isPlaying = false;
            updatePlayPauseButton();
        }
    });
    
    mediaElement.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseButton();
    });
    
    mediaElement.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseButton();
    });
    
    mediaElement.addEventListener('error', (e) => {
        showToast('Error loading media file');
        console.error('Media error:', e);
    });
}

// Play/Pause Control
playPauseBtn.addEventListener('click', togglePlayPause);

// Volume Control (basic functionality)
volumeBtn.addEventListener('click', () => {
    if (isYouTubeMode && youtubePlayer) {
        if (isMuted) {
            youtubePlayer.unMute();
            youtubePlayer.setVolume(previousVolume * 100);
            volumeSlider.value = previousVolume * 100;
            currentVolume = previousVolume;
            isMuted = false;
        } else {
            previousVolume = currentVolume;
            youtubePlayer.mute();
            volumeSlider.value = 0;
            isMuted = true;
        }
        updateVolumeIcon(isMuted ? 0 : currentVolume);
    } else if (mediaElement) {
        if (isMuted) {
            mediaElement.volume = previousVolume;
            volumeSlider.value = previousVolume * 100;
            currentVolume = previousVolume;
            isMuted = false;
        } else {
            previousVolume = currentVolume;
            mediaElement.volume = 0;
            volumeSlider.value = 0;
            isMuted = true;
        }
        updateVolumeIcon(mediaElement.volume);
    }
});

// Skip Controls (basic functionality)
rewind10Btn.addEventListener('click', () => {
    if (isYouTubeMode && youtubePlayer) {
        const currentTime = youtubePlayer.getCurrentTime();
        youtubePlayer.seekTo(Math.max(0, currentTime - skipDuration), true);
        showToast(`⏪ -${skipDuration}s`);
    } else if (mediaElement) {
        mediaElement.currentTime = Math.max(0, mediaElement.currentTime - skipDuration);
        showToast(`⏪ -${skipDuration}s`);
    }
});

forward10Btn.addEventListener('click', () => {
    if (isYouTubeMode && youtubePlayer) {
        const currentTime = youtubePlayer.getCurrentTime();
        const duration = youtubePlayer.getDuration();
        youtubePlayer.seekTo(Math.min(duration, currentTime + skipDuration), true);
        showToast(`⏩ +${skipDuration}s`);
    } else if (mediaElement) {
        mediaElement.currentTime = Math.min(mediaElement.duration, mediaElement.currentTime + skipDuration);
        showToast(`⏩ +${skipDuration}s`);
    }
});

function togglePlayPause() {
    console.log('togglePlayPause called', { isYouTubeMode, mediaElement, isPlaying });
    
    if (isYouTubeMode && youtubePlayer) {
        const state = youtubePlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            youtubePlayer.pauseVideo();
        } else {
            youtubePlayer.playVideo();
        }
    } else if (mediaElement) {
        if (isPlaying) {
            mediaElement.pause();
            showToast('Paused');
        } else {
            mediaElement.play().then(() => {
                showToast('Playing');
            }).catch(err => {
                console.log('Play failed:', err);
                showToast('Click to play - autoplay blocked');
            });
        }
    } else {
        showToast('Load a file first');
    }
}

function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

// Progress Bar Control - handled in YouTube section below

// Volume Control - handled in YouTube section below

function updateVolumeIcon(volume) {
    const icon = volumeBtn.querySelector('i');
    if (volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

// Speed Control
speedBtn.addEventListener('click', () => {
    speedModal.classList.add('active');
});

speedModal.addEventListener('click', (e) => {
    if (e.target === speedModal) {
        speedModal.classList.remove('active');
    }
});

document.querySelectorAll('.speed-option').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!mediaElement) return;
        
        const speed = parseFloat(btn.dataset.speed);
        mediaElement.playbackRate = speed;
        currentSpeed = speed;
        
        // Update UI
        document.querySelectorAll('.speed-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        speedBtn.querySelector('.speed-label').textContent = speed + 'x';
        
        speedModal.classList.remove('active');
        showToast(`Speed: ${speed}x`);
    });
});

// Repeat Control
repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    if (mediaElement) {
        mediaElement.loop = isRepeating;
    }
    repeatBtn.classList.toggle('active');
    showToast(isRepeating ? 'Repeat: ON' : 'Repeat: OFF');
});

// Fullscreen Control
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen().catch(err => {
            showToast('Fullscreen not available');
        });
        fullscreenBtn.querySelector('i').className = 'fas fa-compress';
    } else {
        document.exitFullscreen();
        fullscreenBtn.querySelector('i').className = 'fas fa-expand';
    }
});

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.querySelector('i').className = 'fas fa-expand';
    }
});

// Playlist Control
playlistBtn.addEventListener('click', () => {
    playlistModal.classList.add('active');
    renderPlaylist();
});

closePlaylist.addEventListener('click', () => {
    playlistModal.classList.remove('active');
});

playlistModal.addEventListener('click', (e) => {
    if (e.target === playlistModal) {
        playlistModal.classList.remove('active');
    }
});

function addToPlaylist(file, url) {
    const exists = playlist.find(item => item.name === file.name);
    if (!exists) {
        playlist.push({ name: file.name, url: url, file: file });
        currentPlaylistIndex = playlist.length - 1;
    } else {
        currentPlaylistIndex = playlist.findIndex(item => item.name === file.name);
    }
    updatePlaylistCount();
}

function updatePlaylistCount() {
    const countElem = document.querySelector('.playlist-count');
    if (countElem) {
        countElem.textContent = playlist.length;
        countElem.style.display = playlist.length > 0 ? 'block' : 'none';
    }
}

function renderPlaylist() {
    if (playlist.length === 0) {
        playlistItems.innerHTML = `
            <div class="empty-playlist">
                <i class="fas fa-music"></i>
                <p>No items in playlist</p>
            </div>
        `;
        return;
    }
    
    const displayList = isShuffled ? shuffledPlaylist : playlist;
    
    playlistItems.innerHTML = displayList.map((item, index) => `
        <div class="playlist-item ${index === currentPlaylistIndex ? 'active' : ''}" data-index="${index}">
            <div>
                <i class="fas ${index === currentPlaylistIndex ? 'fa-volume-up' : 'fa-music'}"></i>
                <span>${item.name}</span>
            </div>
            <button class="remove-btn" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-btn')) {
                const index = parseInt(item.dataset.index);
                playFromPlaylist(index);
                playlistModal.classList.remove('active');
            }
        });
    });
    
    // Remove button listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            removeFromPlaylist(index);
        });
    });
}

function removeFromPlaylist(index) {
    playlist.splice(index, 1);
    if (currentPlaylistIndex >= index && currentPlaylistIndex > 0) {
        currentPlaylistIndex--;
    }
    updatePlaylistCount();
    renderPlaylist();
    showToast('Removed from playlist');
}

function playFromPlaylist(index) {
    if (index >= 0 && index < playlist.length) {
        currentPlaylistIndex = index;
        const item = playlist[index];
        loadMedia(item.file);
    }
}

// Previous/Next Controls
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);

function playPrevious() {
    if (playlist.length === 0) {
        showToast('Playlist is empty');
        return;
    }
    if (playlist.length === 1) {
        if (mediaElement) {
            mediaElement.currentTime = 0;
            mediaElement.play();
        }
        return;
    }
    currentPlaylistIndex = (currentPlaylistIndex - 1 + playlist.length) % playlist.length;
    playFromPlaylist(currentPlaylistIndex);
}

function playNext() {
    if (playlist.length === 0) {
        showToast('Playlist is empty');
        return;
    }
    if (playlist.length === 1) {
        if (mediaElement) {
            mediaElement.currentTime = 0;
            mediaElement.play();
        }
        return;
    }
    currentPlaylistIndex = (currentPlaylistIndex + 1) % playlist.length;
    playFromPlaylist(currentPlaylistIndex);
}

// Shuffle Functionality
shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
    
    if (isShuffled) {
        shufflePlaylist();
        showToast('Shuffle: ON');
    } else {
        shuffledPlaylist = [];
        showToast('Shuffle: OFF');
    }
});

function shufflePlaylist() {
    shuffledPlaylist = [...playlist];
    for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
    }
}

// 10 Second Skip Buttons - handled in YouTube section below

// Audio Only Mode
audioOnlyBtn.addEventListener('click', () => {
    isAudioOnly = !isAudioOnly;
    audioOnlyBtn.classList.toggle('active');
    
    // Handle YouTube audio-only mode
    if (isYouTubeMode && youtubePlayer) {
        toggleYouTubeAudioOnly();
        showToast(isAudioOnly ? 'Audio Only: ON' : 'Audio Only: OFF');
        return;
    }
    
    // Handle local video audio-only mode
    if (mediaElement && mediaElement.tagName === 'VIDEO') {
        const currentTime = mediaElement.currentTime;
        const wasPlaying = isPlaying;
        const currentFile = playlist[currentPlaylistIndex]?.file;
        
        if (currentFile) {
            loadMedia(currentFile);
            setTimeout(() => {
                if (mediaElement) {
                    mediaElement.currentTime = currentTime;
                    if (wasPlaying) {
                        mediaElement.play().catch(err => console.log('Play error:', err));
                    }
                }
            }, 100);
        }
    }
    
    showToast(isAudioOnly ? 'Audio Only: ON' : 'Audio Only: OFF');
});

function toggleYouTubeAudioOnly() {
    const ytPlayerFrame = document.getElementById('youtubePlayer');
    if (!ytPlayerFrame) return;
    
    if (isAudioOnly) {
        // Hide video, show audio indicator
        ytPlayerFrame.style.display = 'none';
        
        // Create audio-only indicator
        const audioIndicator = document.createElement('div');
        audioIndicator.className = 'youtube-audio-indicator';
        audioIndicator.id = 'ytAudioIndicator';
        
        const videoData = youtubePlayer.getVideoData();
        const title = videoData?.title || 'YouTube Audio';
        
        audioIndicator.innerHTML = `
            <div class="audio-visualizer">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
            <i class="fas fa-music"></i>
            <h2>Audio Only Mode</h2>
            <p class="yt-title">${title}</p>
            <small>Video hidden to save bandwidth</small>
        `;
        
        playerContainer.appendChild(audioIndicator);
        
        // Animate bars when playing
        if (isPlaying) {
            startAudioVisualization();
        }
    } else {
        // Show video, remove indicator
        ytPlayerFrame.style.display = 'block';
        const indicator = document.getElementById('ytAudioIndicator');
        if (indicator) {
            indicator.remove();
        }
        stopAudioVisualization();
    }
}

let visualizationInterval = null;

function startAudioVisualization() {
    const bars = document.querySelectorAll('.youtube-audio-indicator .bar');
    if (bars.length === 0) return;
    
    visualizationInterval = setInterval(() => {
        bars.forEach(bar => {
            const height = Math.random() * 80 + 20;
            bar.style.height = height + '%';
        });
    }, 150);
}

function stopAudioVisualization() {
    if (visualizationInterval) {
        clearInterval(visualizationInterval);
        visualizationInterval = null;
    }
}

// Picture-in-Picture functionality removed for cleaner UI
// Can be accessed via right-click on video or browser controls

// Bookmark functionality removed for cleaner UI

// Settings
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
    loadSettingsUI();
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.remove('active');
    saveSettings();
});

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
        saveSettings();
    }
});

function loadSettingsUI() {
    document.getElementById('autoplayNext').checked = autoplayNext;
    document.getElementById('rememberVolume').checked = true;
    document.getElementById('showNotifications').checked = showNotifications;
    document.getElementById('skipDuration').value = skipDuration;
}

document.getElementById('autoplayNext').addEventListener('change', (e) => {
    autoplayNext = e.target.checked;
});

document.getElementById('showNotifications').addEventListener('change', (e) => {
    showNotifications = e.target.checked;
});

document.getElementById('skipDuration').addEventListener('change', (e) => {
    skipDuration = parseInt(e.target.value);
    document.querySelector('#rewind10Btn .time-label').textContent = skipDuration;
    document.querySelector('#forward10Btn .time-label').textContent = skipDuration;
});

// Playlist Actions
clearPlaylistBtn.addEventListener('click', () => {
    if (confirm('Clear entire playlist?')) {
        playlist = [];
        currentPlaylistIndex = -1;
        updatePlaylistCount();
        renderPlaylist();
        showToast('Playlist cleared');
    }
});

sortPlaylistBtn.addEventListener('click', () => {
    playlist.sort((a, b) => a.name.localeCompare(b.name));
    renderPlaylist();
    showToast('Playlist sorted');
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in input
    if (e.target.tagName === 'INPUT') return;
    
    const hasMedia = mediaElement !== null;
    
    switch(e.code) {
        case 'Space':
        case 'KeyK':
            e.preventDefault();
            if (hasMedia) togglePlayPause();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (hasMedia) {
                mediaElement.currentTime = Math.max(0, mediaElement.currentTime - 5);
                showToast('⏪ -5s');
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (hasMedia) {
                mediaElement.currentTime = Math.min(mediaElement.duration, mediaElement.currentTime + 5);
                showToast('⏩ +5s');
            }
            break;
        case 'KeyJ':
            e.preventDefault();
            if (hasMedia) rewind10Btn.click();
            break;
        case 'KeyL':
            e.preventDefault();
            if (hasMedia) forward10Btn.click();
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (hasMedia) {
                const newVolumeUp = Math.min(1, mediaElement.volume + 0.1);
                mediaElement.volume = newVolumeUp;
                volumeSlider.value = newVolumeUp * 100;
                currentVolume = newVolumeUp;
                updateVolumeIcon(newVolumeUp);
                showToast(`🔊 ${Math.round(newVolumeUp * 100)}%`);
            }
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (hasMedia) {
                const newVolumeDown = Math.max(0, mediaElement.volume - 0.1);
                mediaElement.volume = newVolumeDown;
                volumeSlider.value = newVolumeDown * 100;
                currentVolume = newVolumeDown;
                updateVolumeIcon(newVolumeDown);
                showToast(`🔉 ${Math.round(newVolumeDown * 100)}%`);
            }
            break;
        case 'KeyF':
            e.preventDefault();
            fullscreenBtn.click();
            break;
        case 'KeyM':
            e.preventDefault();
            if (hasMedia) volumeBtn.click();
            break;
        case 'KeyP':
            e.preventDefault();
            prevBtn.click();
            break;
        case 'KeyN':
            e.preventDefault();
            nextBtn.click();
            break;
        case 'KeyR':
            e.preventDefault();
            repeatBtn.click();
            break;
        case 'KeyS':
            e.preventDefault();
            shuffleBtn.click();
            break;
        case 'KeyQ':
            e.preventDefault();
            playlistBtn.click();
            break;
        // case 'KeyB': // Bookmark removed
        //     e.preventDefault();
        //     bookmarkBtn.click();
        //     break;
        case 'Slash':
            if (e.shiftKey) {
                e.preventDefault();
                shortcutsHelp.classList.toggle('active');
            }
            break;
        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
            e.preventDefault();
            if (hasMedia) {
                const percent = parseInt(e.code.replace('Digit', '')) / 10;
                mediaElement.currentTime = mediaElement.duration * percent;
                showToast(`${percent * 100}%`);
            }
            break;
    }
    
    // Speed controls with Shift
    if (e.shiftKey && hasMedia) {
        if (e.key === '>') {
            e.preventDefault();
            const newSpeed = Math.min(2, currentSpeed + 0.25);
            mediaElement.playbackRate = newSpeed;
            currentSpeed = newSpeed;
            speedBtn.querySelector('.speed-label').textContent = newSpeed + 'x';
            showToast(`Speed: ${newSpeed}x`);
        } else if (e.key === '<') {
            e.preventDefault();
            const newSpeed = Math.max(0.25, currentSpeed - 0.25);
            mediaElement.playbackRate = newSpeed;
            currentSpeed = newSpeed;
            speedBtn.querySelector('.speed-label').textContent = newSpeed + 'x';
            showToast(`Speed: ${newSpeed}x`);
        }
    }
});

// Close shortcuts help on click
shortcutsHelp.addEventListener('click', () => {
    shortcutsHelp.classList.remove('active');
});

// Utility Functions
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showToast(message) {
    if (!showNotifications) return;
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

// Local Storage Functions
function saveSettings() {
    const settings = {
        volume: currentVolume,
        autoplayNext,
        showNotifications,
        skipDuration
    };
    localStorage.setItem('streamflow_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('streamflow_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        currentVolume = settings.volume || 0.7;
        autoplayNext = settings.autoplayNext || false;
        showNotifications = settings.showNotifications !== false;
        skipDuration = settings.skipDuration || 10;
        volumeSlider.value = currentVolume * 100;
    }
}

// Bookmark functions removed for cleaner UI

// Save volume on change
volumeSlider.addEventListener('change', saveSettings);

// YouTube Integration
youtubeBtn.addEventListener('click', () => {
    youtubeModal.classList.add('active');
    youtubeUrlInput.focus();
});

closeYoutube.addEventListener('click', () => {
    youtubeModal.classList.remove('active');
});

youtubeModal.addEventListener('click', (e) => {
    if (e.target === youtubeModal) {
        youtubeModal.classList.remove('active');
    }
});

loadYoutubeBtn.addEventListener('click', () => {
    const url = youtubeUrlInput.value.trim();
    if (url) {
        loadYouTubeVideo(url);
        youtubeModal.classList.remove('active');
        youtubeUrlInput.value = '';
    } else {
        showToast('Please enter a YouTube URL');
    }
});

youtubeUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadYoutubeBtn.click();
    }
});

function extractYouTubeID(url) {
    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/  // Direct video ID
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

function loadYouTubeVideo(url) {
    const videoId = extractYouTubeID(url);
    
    if (!videoId) {
        showToast('Invalid YouTube URL');
        return;
    }
    
    // Clean up existing media
    if (mediaElement) {
        mediaElement.remove();
        mediaElement = null;
    }
    
    if (youtubeUpdateInterval) {
        clearInterval(youtubeUpdateInterval);
    }
    
    // Clear player container
    playerContainer.innerHTML = '';
    playerContainer.classList.add('youtube-active');
    
    // Create YouTube player container
    const playerDiv = document.createElement('div');
    playerDiv.id = 'youtubePlayer';
    playerContainer.appendChild(playerDiv);
    
    isYouTubeMode = true;
    
    // Initialize YouTube player
    if (typeof YT !== 'undefined' && YT.Player) {
        initYouTubePlayer(videoId);
    } else {
        // Wait for YouTube API to load
        window.onYouTubeIframeAPIReady = () => {
            initYouTubePlayer(videoId);
        };
    }
}

function initYouTubePlayer(videoId) {
    youtubePlayer = new YT.Player('youtubePlayer', {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1
        },
        events: {
            onReady: onYouTubePlayerReady,
            onStateChange: onYouTubePlayerStateChange,
            onError: onYouTubePlayerError
        }
    });
}

function onYouTubePlayerError(event) {
    let errorMessage = 'YouTube video error';
    let showViewButton = true;
    
    // Error codes: 2 = invalid ID, 5 = HTML5 error, 100 = not found, 101/150 = embedding disabled
    switch(event.data) {
        case 2:
            errorMessage = 'Invalid video ID';
            showViewButton = false;
            break;
        case 5:
            errorMessage = 'HTML5 player error';
            break;
        case 100:
            errorMessage = 'Video not found';
            showViewButton = false;
            break;
        case 101:
        case 150:
            errorMessage = 'Video cannot be embedded';
            break;
        default:
            errorMessage = 'Unable to play video';
    }
    
    showToast(errorMessage);
    
    // Show error message with "View on YouTube" button
    const videoId = youtubePlayer.getVideoData().video_id;
    showYouTubeError(errorMessage, videoId, showViewButton);
}

function showYouTubeError(message, videoId, showViewButton = true) {
    playerContainer.innerHTML = '';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'youtube-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h2>${message}</h2>
        <p>This video cannot be played in StreamFlow</p>
        ${showViewButton ? `
            <a href="https://www.youtube.com/watch?v=${videoId}" 
               target="_blank" 
               class="view-youtube-btn">
                <i class="fab fa-youtube"></i>
                View on YouTube
            </a>
            <button class="try-another-btn" id="tryAnotherVideo">
                <i class="fas fa-redo"></i>
                Try Another Video
            </button>
        ` : `
            <button class="try-another-btn" id="tryAnotherVideo">
                <i class="fas fa-redo"></i>
                Try Another Video
            </button>
        `}
    `;
    
    playerContainer.appendChild(errorDiv);
    
    // Add event listener for try another button
    const tryAnotherBtn = document.getElementById('tryAnotherVideo');
    if (tryAnotherBtn) {
        tryAnotherBtn.addEventListener('click', () => {
            youtubeBtn.click();
        });
    }
    
    // Clean up
    isYouTubeMode = false;
    if (youtubeUpdateInterval) {
        clearInterval(youtubeUpdateInterval);
        youtubeUpdateInterval = null;
    }
}

function onYouTubePlayerReady(event) {
    showToast('YouTube video loaded');
    
    // Set volume
    youtubePlayer.setVolume(currentVolume * 100);
    
    // Update UI
    updateYouTubeUI();
    
    // Start update interval
    youtubeUpdateInterval = setInterval(updateYouTubeProgress, 500);
}

function onYouTubePlayerStateChange(event) {
    // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseButton();
        if (isAudioOnly) {
            startAudioVisualization();
        }
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseButton();
        if (isAudioOnly) {
            stopAudioVisualization();
        }
    } else if (event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        updatePlayPauseButton();
        if (isAudioOnly) {
            stopAudioVisualization();
        }
        if (autoplayNext && playlist.length > 1) {
            playNext();
        }
    }
}

function updateYouTubeUI() {
    if (!youtubePlayer || !youtubePlayer.getDuration) return;
    
    const duration = youtubePlayer.getDuration();
    if (duration) {
        totalTimeDisplay.textContent = formatTime(duration);
        progressBar.max = duration;
    }
    
    const videoData = youtubePlayer.getVideoData();
    if (videoData && videoData.title) {
        mediaInfo.innerHTML = `<span class="media-title">${videoData.title}</span>`;
    }
}

function updateYouTubeProgress() {
    if (!youtubePlayer || !youtubePlayer.getCurrentTime) return;
    
    try {
        const currentTime = youtubePlayer.getCurrentTime();
        const duration = youtubePlayer.getDuration();
        
        if (currentTime && duration) {
            currentTimeDisplay.textContent = formatTime(currentTime);
            progressBar.value = currentTime;
            const percentage = (currentTime / duration) * 100;
            progressFill.style.width = percentage + '%';
        }
    } catch (e) {
        // Player not ready yet
    }
}

// YouTube controls integrated into main togglePlayPause function above

// Override progress bar for YouTube
progressBar.addEventListener('input', (e) => {
    if (isYouTubeMode && youtubePlayer) {
        const time = parseFloat(e.target.value);
        if (!isNaN(time)) {
            youtubePlayer.seekTo(time, true);
        }
    } else if (mediaElement) {
        const time = parseFloat(e.target.value);
        if (!isNaN(time) && time >= 0 && time <= mediaElement.duration) {
            mediaElement.currentTime = time;
        }
    }
});

// Override volume for YouTube
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    currentVolume = volume;
    
    if (isYouTubeMode && youtubePlayer) {
        youtubePlayer.setVolume(volume * 100);
        if (volume > 0) {
            youtubePlayer.unMute();
            isMuted = false;
        }
    } else if (mediaElement) {
        mediaElement.volume = volume;
    }
    
    updateVolumeIcon(volume);
    if (volume > 0 && isMuted) {
        isMuted = false;
    }
});

// Duplicate event listeners removed - handled above

// Initialize UI
updateVolumeIcon(currentVolume);
updatePlaylistCount();
updatePlayPauseButton();

// Add click feedback to play button
playPauseBtn.addEventListener('mousedown', () => {
    playPauseBtn.style.transform = 'scale(0.95)';
});

playPauseBtn.addEventListener('mouseup', () => {
    playPauseBtn.style.transform = '';
});

playPauseBtn.addEventListener('mouseleave', () => {
    playPauseBtn.style.transform = '';
});
