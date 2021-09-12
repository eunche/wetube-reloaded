const recordingToggleBtn = document.getElementById("recordingToggleBtn");
const preview = document.getElementById("preview");

// 전역 변수
let stream;
let recorder;
let videoFile;

const handleVideoDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "wetube-video.webm";
  document.body.appendChild(a);
  a.click();
};

const handleRecordingStop = async () => {
  recordingToggleBtn.innerText = "Download Recording";
  recordingToggleBtn.removeEventListener("click", handleRecordingStop);
  recordingToggleBtn.addEventListener("click", handleVideoDownload);
  recorder.stop();
};

const handleRecordingStart = async () => {
  recordingToggleBtn.innerText = "Stop Recording";
  recordingToggleBtn.removeEventListener("click", handleRecordingStart);
  recordingToggleBtn.addEventListener("click", handleRecordingStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    preview.srcObject = null;
    preview.src = videoFile;
    preview.loop = true;
    preview.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  console.log(stream);
  preview.srcObject = stream;
  preview.play();
};

recordingToggleBtn.addEventListener("click", handleRecordingStart);

init();
