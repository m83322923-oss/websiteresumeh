import {
  FaceDetector,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm";

const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusEl = document.getElementById("status");
const message = document.getElementById("message");
const countEl = document.getElementById("count");
const trackingState = document.getElementById("trackingState");

let detector = null;
let stream = null;
let running = false;
let lastVideoTime = -1;

async function createDetector() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
  );

  detector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    minDetectionConfidence: 0.5
  });
}

async function startCamera() {
  try {
    statusEl.textContent = "در حال بارگذاری مدل...";
    await createDetector();

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    running = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    message.style.display = "none";
    statusEl.textContent = "در حال ردیابی";
    trackingState.textContent = "فعال";

    requestAnimationFrame(track);
  } catch (error) {
    console.error(error);
    statusEl.textContent = "خطا";
    trackingState.textContent = "دوربین فعال نشد";
    message.style.display = "block";
    message.textContent =
      "دسترسی دوربین رد شد یا مرورگر از دوربین پشتیبانی نمی‌کند.";
  }
}

function drawFace(box) {
  const x = box.originX;
  const y = box.originY;
  const w = box.width;
  const h = box.height;

  // ویدیو آینه‌ای است؛ مختصات باکس را هم آینه می‌کنیم.
  const mirroredX = canvas.width - x - w;

  ctx.strokeStyle = "#00ff9d";
  ctx.lineWidth = Math.max(3, canvas.width / 400);
  ctx.strokeRect(mirroredX, y, w, h);

  ctx.fillStyle = "#00ff9d";
  ctx.font = `${Math.max(16, canvas.width / 45)}px Arial`;
  ctx.fillText("Face", mirroredX, Math.max(24, y - 10));
}

function track() {
  if (!running || video.readyState < 2) {
    if (running) requestAnimationFrame(track);
    return;
  }

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;

    const result = detector.detectForVideo(video, performance.now());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const detections = result.detections || [];
    countEl.textContent = detections.length;

    detections.forEach((detection) => {
      if (detection.boundingBox) {
        drawFace(detection.boundingBox);
      }
    });

    trackingState.textContent =
      detections.length > 0 ? "چهره پیدا شد" : "در حال جستجو...";
  }

  requestAnimationFrame(track);
}

function stopCamera() {
  running = false;

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  video.srcObject = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  countEl.textContent = "0";
  trackingState.textContent = "آماده";
  statusEl.textContent = "خاموش";
  message.style.display = "block";
  message.textContent = "برای شروع روی «فعال کردن دوربین» بزن.";

  startBtn.disabled = false;
  stopBtn.disabled = true;
}

startBtn.addEventListener("click", startCamera);
stopBtn.addEventListener("click", stopCamera);
