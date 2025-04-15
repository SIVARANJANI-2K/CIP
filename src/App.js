import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
function App() {
  const [topic, setTopic] = useState("");
  const [query, setQuery] = useState(""); 
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // 🔊 Voice toggle
  const API_URL = "https://5742-34-75-64-227.ngrok-free.app";
  const [mode,setMode]=useState("general");
  const speakSummary = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
    
  };
  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
  };
  
  console.log(mode)
  const summarizeTopic = async () => {
    if (!topic) return;
    setLoading(true);
    setSummary("");

    try {
      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("query", query || "None");
      formData.append("mode",mode);
      const response = await axios.post(`${API_URL}/summarize`, formData);
      const result=response.data.summary;
      setSummary(result);
      if (voiceEnabled && result) speakSummary(result);
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
      const result = response.data.summary;
      setSummary(result);
      if (voiceEnabled && result) speakSummary(result);
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
              {/* <p className="leading-relaxed text-gray-300 whitespace-pre-line">{summary}</p> */}
              <div className="prose prose-invert max-w-none text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{summary}</ReactMarkdown>
              </div>
              <button
            onClick={() => speakSummary(summary)}
            className="mt-2 px-3 py-1 bg-purple-500 text-white rounded-md"
          >
            🔊 Speak Again
          </button>
          <button
  onClick={stopSpeaking}
  className="mt-2 ml-3 px-3 py-1 bg-red-600 text-white rounded-md"
>
  ⏹️ Stop
</button>

            </div>
          ) : (
            <p className="text-gray-400">Enter a topic or upload a document to generate a summary.</p>
          )}
        </div>
      </div>

      {/* Input Section at Bottom */}
      <div className="flex flex-col items-center pb-5">
        {/* Topic-based summarization */}
      <div className="mb-4 flex flex-col items-center gap-2">
        <div className="flex gap-3 flex-wrap justify-center">
          <input
            type="text"
            placeholder="Enter topic..."
            className="p-2 border rounded-md w-72 bg-gray-800 text-white"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
              type="text"
              placeholder="Optional query (e.g., focus on impacts)"
              className="p-2 border rounded-md w-72 bg-gray-800 text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          <button
            onClick={summarizeTopic}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
          >
            {loading ? "Summarizing..." : "Summarize Topic"}
          </button>
        </div>
        <div className="flex gap-2 mt-2">
            <button className={`flex items-center gap-1 px-3 py-1 rounded-full border 
      ${mode === "interview" ? "bg-blue-600 text-white border-blue-500" : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"}`} onClick={()=>setMode("interview")}>
              🌐 Interview
            </button>
            <button className={`flex items-center gap-1 px-3 py-1 rounded-full border 
      ${mode === "case-study" ? "bg-blue-600 text-white border-blue-500" : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"}`} onClick={()=>setMode("case-study")}>
              💡 Case Study
            </button>
            <button className={`flex items-center gap-1 px-3 py-1 rounded-full border 
      ${mode === "teaching-notes" ? "bg-blue-600 text-white border-blue-500" : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"}`} onClick={()=>setMode("teaching-notes")}>
              📘 Teaching Notes
            </button>
         </div>
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
