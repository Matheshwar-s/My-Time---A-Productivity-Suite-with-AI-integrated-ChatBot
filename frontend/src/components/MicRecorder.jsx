import { useState, useRef } from "react";

export default function MicRecorder({ onDone }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      onDone(url);
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  return (
    <div>
      {recording ? (
        <button className="bg-red-600 text-white px-4 py-2" onClick={stopRecording}>
          Stop
        </button>
      ) : (
        <button className="bg-green-600 text-white px-4 py-2" onClick={startRecording}>
          Start Recording
        </button>
      )}
    </div>
  );
}
