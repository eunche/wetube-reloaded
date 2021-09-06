const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlayClick = (event) => {
  // if 동영상이 멈춰있으면 -> 재생 하고
  // else 멈춘다
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handlePause = (event) => {
  playBtn.innerText = "Play";
};

const handlePlay = (event) => {
  playBtn.innerText = "Pause";
};

const handleMute = (event) => {};
const handleTime = (event) => {};
const handleVolume = (event) => {};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
time.addEventListener("click", handleTime);
volume.addEventListener("click", handleVolume);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
