import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  Pencil,
  CheckLine,
  Send,
  MailCheck,
  X,
  Mail,
  CloudHail,
} from "lucide-react";
function App() {
  const [mode, setMode] = useState("raw"); // raw | file
  const [text, setText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [airesponse, setaiResponse] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isedit, setIsedit] = useState(false);
  const [editableResponse, setEditableResponse] = useState(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false); // For loading state
  const suggestions = [
    "Highlight only action items",
    "Summarize in bullet points for executives",
    "Give me the crisp important thing in 1 line",
    "Summarize in 50–100 words",
    "Explain like I’m five (ELI5)",
    "Summarize with pros and cons",
    "Turn this into key takeaways",
    "Give me a tweet-sized version (≤280 chars)",
    "Summarize in 3–5 bullet points",
    "Provide a headline-style summary",
    "Make it a checklist",
    "Explain in simple layman terms",
    "Summarize with an analogy",
    "Give me only numbers, stats, and metrics",
    "Highlight risks and opportunities only",
    "Summarize for a technical audience",
    "Summarize for a non-technical audience",
    "Provide a Q&A style summary",
    "Turn it into a short story/analogy",
    "Highlight what’s new or different only",
  ];
  const handleemail = async () => {
    try {
      setIsSending(true);
  
      if (!recipientEmail || !airesponse) {
        toast.error(
          "Please enter a valid email and generate a summary first!"
        );
        setIsSending(false);
        return;
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sendmail`, {
        recipientEmail,
        summary: airesponse,
      });
      if (response.data.response) {
        toast.success("Email sent successfully!");
        setIsEmailDialogOpen(false);
        setRecipientEmail("");
      } else {
        setIsSending(false);
        toast.error("Failed to send email: " + response.data.message);
      }
      setIsSending(false);
    } catch (error) {
      console.log(error);
      setIsSending(false);
      toast.error("Failed to send email: " + error.message);
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
        toast.success("File uploaded successfully!");
      };
      reader.readAsText(file);
    } else {
      toast.error("⚠️ Please upload a valid .txt file only");
    }
  };
  const handleSummarise = async () => {
    if (!text.trim()) {
      toast.error("Please enter or upload some text first!");
      return;
    }

    setLoader(true);
    setaiResponse(null);

    const payload = {
      text: text + (customPrompt ? `\n\nInstruction: ${customPrompt}` : ""),
    };
    const summarisePromise = axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/apiresponse`, payload)
      .then((response) => {
        setaiResponse(response.data.summary);
        setEditableResponse(response.data.summary);
        return "Summary generated successfully!";
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Failed to generate summary");
      })
      .finally(() => setLoader(false));

    toast.promise(summarisePromise, {
      loading: "⏳ Summarising your text...",
      success: (msg) => msg,
      error: (err) => err.message || "Something went wrong",
    });
  };

  return (
    <div className="app-container">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        className="app-header"
      >
        <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          AI powered meeting notes summarizer and sharer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="subtitle"
        >
          Smartly summarise your transcripts and notes with AI ⚡
        </motion.p>
      </motion.header>

      <motion.div
        className="mode-toggle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className={mode === "raw" ? "active" : ""}
          onClick={() => setMode("raw")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ marginRight: "50px" }}
        >
          ✍️ Raw Text
        </motion.button>
        <motion.button
          className={mode === "file" ? "active" : ""}
          onClick={() => setMode("file")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          📂 Upload .txt
        </motion.button>
      </motion.div>

      <motion.section
        className="input-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {mode === "raw" ? (
          <motion.textarea
            placeholder="Paste your transcript or text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="file-upload-wrapper"
          >
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-upload-label">
              Choose a .txt file
            </label>
          </motion.div>
        )}

        <div className="suggestions-container">
          <motion.input
            type="text"
            placeholder="Enter custom instructions (optional)"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="custom-prompt-input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                className="suggestions-dropdown"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setCustomPrompt(suggestion);
                      setShowSuggestions(false);
                    }}
                    whileHover={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="suggestion-content">
                      <span className="suggestion-text">{suggestion}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          onClick={handleSummarise}
          disabled={loader}
          className="summarise-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {loader ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ display: "inline-block" }}
            >
              ⏳
            </motion.span>
          ) : (
            "Summarise"
          )}
        </motion.button>
      </motion.section>
      <AnimatePresence>
        {airesponse && (
          <motion.section
            className="summary-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h2
              className="summary-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Summary
            </motion.h2>

            {isedit ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <textarea
                  value={editableResponse}
                  onChange={(e) => setEditableResponse(e.target.value)}
                  className="edit-textarea"
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <button
                    style={{ marginRight: "20px" }}
                    onClick={() => {
                      setaiResponse(editableResponse);
                      setIsedit(false);
                    }}
                  >
                    <CheckLine />
                  </button>
                  <button onClick={() => setIsedit(false)}>
                    <X />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="markdown-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ReactMarkdown>{airesponse}</ReactMarkdown>
              </motion.div>
            )}
            {!isedit && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  style={{ marginRight: "20px" }}
                  onClick={() => {
                    setEditableResponse(airesponse);
                    setIsedit(true);
                  }}
                >
                  <Pencil />
                </button>
                <button
                  onClick={() => setIsEmailDialogOpen(true)}
                  style={{ marginRight: "20px" }}
                >
                  <MailCheck />
                </button>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {!airesponse && (
        <motion.section
          className="summary-placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Your summary will appear here after processing.</p>
        </motion.section>
      )}

      {isEmailDialogOpen && (
        <motion.div
          className="email-dialog-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsEmailDialogOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            className="email-dialog"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3>Send via Email</h3>
            <input
              type="email"
              placeholder="Enter recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button onClick={() => setIsEmailDialogOpen(false)}>
                <X />
              </button>
              <button
                onClick={handleemail}
                disabled={isSending || !recipientEmail}
                style={{
                  background: isSending ? "#ccc" : "#007bff",
                  color: "white",
                }}
              >
                {isSending ? "Sending..." : <Send />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>&copy; 2025 AI Summariser. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

export default App;
