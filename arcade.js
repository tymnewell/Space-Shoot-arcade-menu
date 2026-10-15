const items = document.querySelectorAll('.game-item');
const demoVideo = document.getElementById('demo-video');
const menuContainer = document.getElementById('menu-container');

let currentIndex = 0;
let idleTimer;
const IDLE_TIME_MS = 20000; // 20 seconds 

// Audio Controller 
let bgMusic = new Audio('mainmenu.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5; // Starts at comfortable mid-range
let audioStarted = false;

// Attempt to start bgMusic on first user interaction 
function tryPlayAudio() {
    if (!audioStarted) {
        bgMusic.play().then(() => {
            audioStarted = true;
        }).catch(err => {
            console.log("Audio waiting for stronger user gesture to launch: ", err);
        });
    }
}

// Initialize the arcade interface
resetIdleTimer();

// Capture UI action inputs
window.addEventListener('keydown', (e) => {
    // Play audio on first button press
    tryPlayAudio();
    
    resetIdleTimer();
    
    // Prevent default browser scrolling
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % items.length;
        updateSelection();
    } 
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateSelection();
    } 
    else if (e.key === ' ' || e.key.toLowerCase() === 'r') {
        // Stop audio before launching game
        bgMusic.pause();
        const targetUrl = items[currentIndex].getAttribute('data-target');
        window.location.href = targetUrl;
    }
});

// Also trigger on mouse click (for ease of PC testing)
window.addEventListener('mousedown', () => {
    tryPlayAudio();
    resetIdleTimer();
});

function updateSelection() {
    items.forEach(item => item.classList.remove('selected'));
    items[currentIndex].classList.add('selected');
}

// --- Attract Mode (Idle) Video Countdown Timer ---
function resetIdleTimer() {
    clearTimeout(idleTimer);
    
    if (demoVideo.style.display === 'block') {
        demoVideo.pause();
        demoVideo.currentTime = 0;
        demoVideo.style.display = 'none';
        menuContainer.style.display = 'flex';
        // Resume music on wakeup
        if (audioStarted) {
            bgMusic.play();
        }
    }
    
    // Begin 20 second countdown
    idleTimer = setTimeout(playDemo, IDLE_TIME_MS);
}

function playDemo() {
    // Pause music when demo video runs
    bgMusic.pause();
    
    menuContainer.style.display = 'none';
    demoVideo.style.display = 'block';
    demoVideo.play();
}