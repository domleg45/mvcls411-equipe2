let currentSession;
let currentMediaSession;
let isPlaying = true;
let currentVideoIndex = 0;
let currentVideoUrl;
let updateInterval;
let remotePlayerController; // Declare remotePlayerController at a higher scope

const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');
const defaultContentType = 'video/mp4';
const applicationID = '3DDC41A0';
const videoList = [
    'https://transfertco.ca/video/DBillPrelude.mp4',
    'https://transfertco.ca/video/DBillSpotted.mp4',
    'https://transfertco.ca/video/usa23_7_02.mp4'
    // Add more video URLs as needed
];

document.getElementById('connectButton').addEventListener('click', () => {
    initializeApiOnly();
});

document.getElementById('startBtn').addEventListener('click', () => {
    if (currentSession) {
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
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
        const currentTime = currentMediaSession.getEstimatedTime();
        const newTime = Math.max(0, Math.min(currentTime + seconds, currentMediaSession.media.duration));
        currentMediaSession.seek(newTime);
    }
}

function sessionListener(newSession) {
    currentSession = newSession;
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
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
    const remotePlayer = new cast.framework.RemotePlayer();
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

    currentSession.loadMedia(request, mediaSession => {
        console.log('Media chargé avec succès');
        initializeSeekSlider(remotePlayerController, mediaSession);
    }, onError);
}

function initializeSeekSlider(remotePlayerController, mediaSession) {
    currentMediaSession = mediaSession;
    document.getElementById('playBtn').style.display = 'block';

      document.getElementById('fastForward').addEventListener('click', () => {
        if (currentMediaSession && remotePlayerController) {
            const currentTime = currentMediaSession.getEstimatedTime();
            const seekTime = currentTime + 10000;
            remotePlayerController.seek(seekTime);
        }
    });
    document.getElementById('fastBackward').addEventListener('click', () => {
        if (currentMediaSession && remotePlayerController) {
            const currentTime = currentMediaSession.getEstimatedTime();
            const seekTime = currentTime - 10000;
            remotePlayerController.seek(seekTime);
        }
    });
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

    chrome.cast.initialize(apiConfig, () => {
        console.log('Chromecast initialized successfully');
    }, error => {
        console.error('Chromecast initialization error:', error);
    });
}

function loadMedia(videoUrl) {
    currentVideoUrl = videoUrl;
    const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, defaultContentType);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    const remotePlayer = new cast.framework.RemotePlayer();
    remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer); // Assign to remotePlayerController here

    currentSession.loadMedia(request, mediaSession => {
        console.log('Media chargé avec succès');
        initializeSeekSlider(remotePlayerController, mediaSession);
    }, onError);
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
