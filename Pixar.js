// PixCam Lite: Record live Pixar-style video and download it

import React, { useEffect, useRef, useState } from 'react'; import './App.css';

function App() { const videoRef = useRef(null); const canvasRef = useRef(null); const mediaRecorderRef = useRef(null); const chunks = useRef([]); const [recording, setRecording] = useState(false); const [downloadURL, setDownloadURL] = useState(null);

useEffect(() => { // Access webcam navigator.mediaDevices.getUserMedia({ video: true, audio: true }) .then((stream) => { videoRef.current.srcObject = stream; videoRef.current.play(); }); }, []);

const startRecording = () => { const stream = canvasRef.current.captureStream(30); const recorder = new MediaRecorder(stream); mediaRecorderRef.current = recorder;

recorder.ondataavailable = (e) => {
  chunks.current.push(e.data);
};

recorder.onstop = () => {
  const blob = new Blob(chunks.current, { type: 'video/webm' });
  chunks.current = [];
  const url = URL.createObjectURL(blob);
  setDownloadURL(url);
};

recorder.start();
setRecording(true);

};

const stopRecording = () => { mediaRecorderRef.current.stop(); setRecording(false); };

const drawToCanvas = () => { const ctx = canvasRef.current.getContext('2d'); const draw = () => { ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

// Apply a cartoon/Pixar-like effect (simple mock)
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255, 200, 255, 0.05)';
  ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  requestAnimationFrame(draw);
};
draw();

};

useEffect(() => { drawToCanvas(); }, []);

return ( <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white p-4 space-y-6"> <h1 className="text-4xl font-bold">PixCam Lite</h1> <p className="text-lg">Record yourself with a Pixar-style filter and download it!</p>

<div className="relative w-full max-w-md">
    <video ref={videoRef} className="hidden" />
    <canvas ref={canvasRef} width={640} height={480} className="rounded-2xl shadow-lg" />
  </div>

  <div className="space-x-4">
    {!recording ? (
      <button
        onClick={startRecording}
        className="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600"
      >
        Start Recording
      </button>
    ) : (
      <button
        onClick={stopRecording}
        className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600"
      >
        Stop Recording
      </button>
    )}

    {downloadURL && (
      <a
        href={downloadURL}
        download="pixcam-video.webm"
        className="bg-blue-500 px-6 py-2 rounded-full hover:bg-blue-600"
      >
        Download Video
      </a>
    )}
  </div>
</div>

); }

export default App;

