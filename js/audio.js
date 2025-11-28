// Add this inside the <script> tag at the bottom of the HTML
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.querySelector('.progress-bar');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');

let audio = new Audio('../html/test.mp3');
let isPlaying = false;

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    
    currentTimeSpan.textContent = formatTime(audio.currentTime);
    durationSpan.textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

playPauseBtn.addEventListener('click', togglePlayPause);
audio.addEventListener('timeupdate', updateProgress);
