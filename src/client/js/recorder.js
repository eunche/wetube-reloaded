import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordingToggleBtn = document.getElementById("recordingToggleBtn");
const preview = document.getElementById("preview");

// 전역 변수
let stream;
let recorder;
let videoFile;

const handleVideoDownload = async () => {
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: `/ffmpeg/ffmpeg-core.js`,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "wetube-video.mp4";
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "wetube-thumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
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
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  } catch (error) {
    console.log(error);
    recordingToggleBtn.parentNode.remove();
    return;
  }
  console.log(stream);
  preview.srcObject = stream;
  preview.play();
};

recordingToggleBtn.addEventListener("click", handleRecordingStart);

init();
