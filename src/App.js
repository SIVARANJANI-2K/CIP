import { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // 🔊 Voice toggle

  const API_URL = "https://8c06-34-82-223-245.ngrok-free.app/"; // Your API

  // 🔊 Function to speak the summary
  const speakSummary = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
  };

  // 🔤 Summarize topic
  const summarizeTopic = async () => {
    if (!topic) return;
    setLoading(true);
    setSummary("");

    try {
      const formData = new FormData();
      formData.append("topic", topic);

      const response = await axios.post(`${API_URL}/summarize`, formData);
      const result = response.data.summary;
      setSummary(result);
      if (voiceEnabled && result) speakSummary(result); // 🔊 Speak if enabled
    } catch (error) {
      console.error("Error summarizing topic:", error);
      setSummary("Error generating summary.");
    }

    setLoading(false);
  };

  // 📄 Summarize uploaded document
  const summarizeDocument = async () => {
    if (!file) return;
    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/summarize`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = response.data.summary;
      setSummary(result);
      if (voiceEnabled && result) speakSummary(result); // 🔊 Speak if enabled
    } catch (error) {
      console.error("Error summarizing document:", error);
      setSummary("Error processing document.");
    }

    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-4">Let’sRevise - Text Summarizer</h1>

      {/* Topic-based summarization */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter topic..."
          className="p-2 border rounded-md w-80"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          onClick={summarizeTopic}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? "Summarizing..." : "Summarize Topic"}
        </button>
      </div>

      {/* File upload */}
      <div className="mb-6">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
        <button
          onClick={summarizeDocument}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          {loading ? "Processing..." : "Summarize Document"}
        </button>
      </div>

      {/* 🔊 Voice Toggle */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={() => setVoiceEnabled(!voiceEnabled)}
          />
          <span>Enable Voice Output</span>
        </label>
      </div>

      {/* Display Summary */}
      {summary && (
        <div className="mt-4 p-3 bg-white border rounded-md w-full max-w-lg">
          <h2 className="font-semibold">Summary:</h2>
          <p>{summary}</p>
          <button
            onClick={() => speakSummary(summary)}
            className="mt-2 px-3 py-1 bg-purple-500 text-white rounded-md"
          >
            🔊 Speak Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

