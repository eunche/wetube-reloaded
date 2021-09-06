// DOM References
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const time = document.getElementById("time");

// 전역 변수
let volumeValue = 0.5;
video.volume = volumeValue;

const handleTime = (event) => {};

const handleVolumeChange = (event) => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  const { value } = event.target;
  video.volume = value;
  volumeValue = value;
};

const handleMuteClick = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handlePlayClick = (event) => {
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
time.addEventListener("click", handleTime);
