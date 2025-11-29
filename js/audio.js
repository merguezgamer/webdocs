// Audio elements
const playPauseBtn = document.getElementById('playPauseBtn');
const restartBtn = document.getElementById('restartBtn'); // nouveau bouton
const progressContainer = document.querySelector('.progress'); // clic ici
const progressBar = document.querySelector('.progress-bar');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');

let audio = new Audio('../media/Montage_audio.mp4');
let isPlaying = false;

// --- LECTURE / PAUSE ---
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

// --- REMETTRE À ZÉRO ---
function restartAudio() {
    audio.currentTime = 0;
    if (!isPlaying) togglePlayPause(); // relance si était stoppé
}

// --- BARRE DE PROGRESSION (MAJ) ---
function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);

    currentTimeSpan.textContent = formatTime(audio.currentTime);
    durationSpan.textContent = formatTime(audio.duration);
}

// --- CLIQUER SUR LA BARRE POUR MODIFIER LA POSITION ---
function setAudioProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
}

// --- FORMATAGE DU TEMPS ---
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Événements
playPauseBtn.addEventListener('click', togglePlayPause);
restartBtn.addEventListener('click', restartAudio);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setAudioProgress);

// met à jour la durée une fois chargée
audio.addEventListener('loadedmetadata', () => {
    durationSpan.textContent = formatTime(audio.duration);
});
