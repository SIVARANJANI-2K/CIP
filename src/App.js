import { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "https://4ace-35-231-208-113.ngrok-free.app";

  const summarizeTopic = async () => {
    if (!topic) return;
    setLoading(true);
    setSummary("");

    try {
      const formData = new FormData();
      formData.append("topic", topic);

      const response = await axios.post(`${API_URL}/summarize`, formData);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing topic:", error);
      setSummary("Error generating summary.");
    }
    setLoading(false);
  };

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
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing document:", error);
      setSummary("Error processing document.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-5">
      {/* Summary Section */}
      <div className="flex-grow flex justify-center items-start">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-3/5 text-left">
          <h1 className="text-3xl font-bold mb-4 text-yellow-400">Let’sRevise - Text Summarizer</h1>
          {summary ? (
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-2 text-blue-400">Summary:</h2>
              <p className="leading-relaxed text-gray-300 whitespace-pre-line">{summary}</p>
            </div>
          ) : (
            <p className="text-gray-400">Enter a topic or upload a document to generate a summary.</p>
          )}
        </div>
      </div>

      {/* Input Section at Bottom */}
      <div className="flex flex-col items-center pb-5">
        {/* Topic-based summarization */}
        <div className="mb-4 flex gap-3">
          <input
            type="text"
            placeholder="Enter topic..."
            className="p-2 border rounded-md w-80 bg-gray-800 text-white"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={summarizeTopic}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
          >
            {loading ? "Summarizing..." : "Summarize Topic"}
          </button>
        </div>

        {/* File upload for summarization */}
        <div className="flex gap-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-gray-400"
          />
          <button
            onClick={summarizeDocument}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
          >
            {loading ? "Processing..." : "Summarize Document"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
