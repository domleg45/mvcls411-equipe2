let currentSession;
let currentMediaSession;
let isPlaying = true;
let currentVideoIndex = 0;
let currentVideoUrl;
let updateInterval;
let lastVolumeLevel = 1;
const seekSlider = document.getElementById('seekSlider');
const muteToggle = document.getElementById('muteToggle');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');
const defaultContentType = 'video/mp4';
const videoList = [
    'https://transfertco.ca/video/DBillPrelude.mp4',
    'https://transfertco.ca/video/DBillSpotted.mp4',
    'https://transfertco.ca/video/usa23_7_02.mp4',
    "https://github.com/domleg45/mvcls411-equipe2/blob/main/Truc.mp4"
];

document.getElementById('connectButton').addEventListener('click', () => {
    initializeApiOnly();
});

document.getElementById('startBtn').addEventListener('click', () => {
    if (currentSession) {
        if(localStorage.getItem('currentVideoIndexLS')) {
            loadMedia(videoList[localStorage.getItem('currentVideoIndexLS')]);
        } else {
            loadMedia(videoList[currentVideoIndex]);
        }
        
       
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
        localStorage.setItem('currentVideoIndexLS', currentVideoIndex);
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});

document.getElementById('previousBtn').addEventListener('click', () => {
    if (currentSession) {
        if (currentVideoIndex == 0) {
            currentVideoIndex = videoList.length - 1; 
        } else {
            currentVideoIndex = (currentVideoIndex - 1) % videoList.length;
        }
        localStorage.setItem('currentVideoIndexLS', currentVideoIndex);
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (currentMediaSession) {
        if (isPlaying) {
            currentMediaSession.pause(null, onMediaCommandSuccess, onError);
        } else {
            currentMediaSession.play(null, onMediaCommandSuccess, onError);
        }
        isPlaying = !isPlaying;
    }
});

document.getElementById('fastBackward').addEventListener('click', () => {
    seekBy(-10);
});

document.getElementById('fastForward').addEventListener('click', () => {
    seekBy(10);
});

function seekBy(seconds) {
    if (currentMediaSession) {
        const seekRequest = new chrome.cast.media.SeekRequest();
        const currentTime = currentMediaSession.getEstimatedTime();
        const newTime = Math.max(0, Math.min(currentTime + seconds, currentMediaSession.media.duration));
        seekRequest.currentTime = newTime;

        currentMediaSession.seek(seekRequest);
    }
}

document.getElementById('increaseVolumeBtn').addEventListener('click', () => {
    adjustVolume(1);
});

document.getElementById('decreaseVolumeBtn').addEventListener('click', () => {
    adjustVolume(-1);
});

function adjustVolume(delta) {
    if (currentMediaSession) {
        const currentVolume = currentMediaSession.volume.level;
        const newVolume = Math.max(0, Math.min(1, currentVolume + (delta * 0.1)));
        const volume = new chrome.cast.Volume(newVolume, false);
        const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
        currentMediaSession.setVolume(volumeRequest, onMediaCommandSuccess, onError);
    }
}

document.getElementById('muteToggle').addEventListener('click', () => {
    if (currentMediaSession.volume.muted) {
        // Unmute
        const volume = new chrome.cast.Volume(lastVolumeLevel, false);
        const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
        currentMediaSession.setVolume(volumeRequest, onMediaCommandSuccess, onError);
    } else {
        
        
        lastVolumeLevel = currentMediaSession.volume.level;
        // Mute
        const volume = new chrome.cast.Volume(0, true);
        const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
        currentMediaSession.setVolume(volumeRequest, onMediaCommandSuccess, onError);
    }
});






function sessionListener(newSession) {
    currentSession = newSession;
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('previousBtn').style.display = 'block';
}




function receiverListener(availability) {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById('connectButton').style.display = 'block';
    } else {
        document.getElementById('connectButton').style.display = 'none';
    }
}

function onInitSuccess() {
    console.log('Chromecast init success');
}

function onError(error) {
    console.error('Chromecast initialization error', error);
}

function onMediaCommandSuccess() {
    console.log('Media command success');
}

function initializeApiOnly() {
    const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function loadMedia(videoUrl) {
    currentVideoUrl = videoUrl;
    const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, defaultContentType);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    currentSession.loadMedia(request, mediaSession => {
        console.log('Media chargé avec succès');
        currentMediaSession = mediaSession;
      }, onError);
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
