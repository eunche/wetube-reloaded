// DOM References
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const videoContainer = document.getElementById("videoContainer");
const fullscreenBtn = document.getElementById("fullscreen");

// 전역 변수
let volumeValue = volumeRange.value;
video.volume = volumeValue;

const handlefullscreenBtnClick = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullscreenBtn.innerText = "Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtn.innerText = "Exit Full Screen";
  }
};

const handleTimelineChange = (event) => {
  const { value } = event.target;
  video.currentTime = value;
};

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(15, 4);
};

const handleTimeUpdate = () => {
  const videoCurrentTime = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(videoCurrentTime);
  timeline.value = videoCurrentTime;
};

const handleLoadedMetadata = () => {
  const videoDuration = Math.floor(video.duration);
  totalTime.innerText = formatTime(videoDuration);
  timeline.max = videoDuration;
};

const handleVolumeChange = (event) => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  const { value } = event.target;
  video.volume = value;
  volumeValue = value;
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handlePlayClick = () => {
  // if 동영상이 멈춰있으면 -> 재생 하고
  // else 멈춘다
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handlefullscreenBtnClick);

if (video.readyState == 4) {
  handleLoadedMetadata();
}
