"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Upload, FileText, Bot, AlertTriangle, ShieldCheck, X } from "lucide-react";

export default function MentorPage() {
  const [documentContext, setDocumentContext] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [heroId, setHeroId] = useState("iron_man");
  const [showConfig, setShowConfig] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const storedHero = sessionStorage.getItem("shield_hero");
      if (storedHero) {
        const parsed = JSON.parse(storedHero);
        if (parsed.heroId) setHeroId(parsed.heroId);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      alert("Please upload a standard .txt file for maximum security protocol compliance.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setDocumentContext(event.target.result);
      setDocumentName(file.name);
    };
    reader.readAsText(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setShowConfig(false); // Auto-hide config once chat starts

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          documentContext,
          heroId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to contact mentor");

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `[SYSTEM ERROR] ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--shield-border)", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "1.8rem", color: "var(--shield-white)", letterSpacing: "0.04em", marginBottom: "4px" }}>
            Mission <span className="text-gold-gradient">Intel &amp; Mentor</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--shield-silver)" }}>
            Upload mission parameters (TXT notes) and receive personalized tactical guidance.
          </p>
        </div>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="btn-outline" 
          style={{ padding: "8px 16px", fontSize: "0.8rem", height: "fit-content" }}
        >
          {showConfig ? "Hide Intel Context" : "Configure Intel Context"}
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Context Configuration Panel */}
        <div style={{ 
          width: showConfig ? "350px" : "0", 
          borderRight: showConfig ? "1px solid var(--shield-border)" : "none",
          background: "rgba(10,12,16,0.5)",
          transition: "width 0.3s ease",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          flexShrink: 0
        }}>
          <div style={{ padding: "24px", minWidth: "350px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <FileText size={18} color="var(--shield-gold)" />
              <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--shield-gold)" }}>MISSION DATA (RAG CONTEXT)</h2>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--shield-silver)", marginBottom: "12px", lineHeight: 1.5 }}>
                Identify the course notes or syllabus you want your mentor to analyze. The mentor will restrict its guidance exclusively to this data.
              </p>
              
              <input 
                type="file" 
                accept=".txt" 
                onChange={handleFileUpload} 
                ref={fileInputRef}
                style={{ display: "none" }} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-outline"
                style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "8px", padding: "12px", marginBottom: "12px" }}
              >
                <Upload size={16} /> Select .TXT Data File
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--shield-border)" }} />
                <span style={{ fontSize: "0.6rem", color: "var(--shield-silver)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>OR PASTE BELOW</span>
                <div style={{ flex: 1, height: "1px", background: "var(--shield-border)" }} />
              </div>

              <textarea 
                value={documentContext}
                onChange={(e) => {
                  setDocumentContext(e.target.value);
                  if (e.target.value.length > 0 && !documentName) setDocumentName("Manual Input");
                  if (e.target.value.length === 0) setDocumentName("");
                }}
                className="shield-input"
                placeholder="Paste your notes here..."
                style={{ minHeight: "150px", fontSize: "0.8rem", resize: "vertical" }}
              />
            </div>

            {documentName && (
              <div className="dossier-panel" style={{ padding: "12px", background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <ShieldCheck size={14} color="#10B981" />
                  <span style={{ fontSize: "0.75rem", color: "var(--shield-white)", fontWeight: 600 }}>Active Context Stream</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--shield-silver)", fontFamily: "var(--font-mono)" }}>
                  source: {documentName} <br/>
                  size: {(documentContext.length / 1024).toFixed(2)} KB
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "url('/shield-bg.svg') center/cover no-repeat" }}>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Intro Message */}
            <div style={{ display: "flex", gap: "16px", maxWidth: "80%" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(245,166,35,0.15)", border: "1px solid var(--shield-gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bot size={20} color="var(--shield-gold)" />
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--shield-silver)", marginBottom: "4px", letterSpacing: "0.1em" }}>S.H.I.E.L.D. MENTOR AI</div>
                <div style={{ background: "rgba(17,24,39,0.8)", border: "1px solid var(--shield-border)", padding: "16px", borderRadius: "0 12px 12px 12px", fontSize: "0.9rem", color: "var(--shield-white)", lineHeight: 1.6, backdropFilter: "blur(4px)" }}>
                  Agent, I am online and synced with your psychological profile ({heroId.toUpperCase()}). Please provide mission data (course context) via the configuration pane so I may begin tutoring.
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", maxWidth: "80%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: msg.role === "user" ? "rgba(255,255,255,0.1)" : "rgba(245,166,35,0.15)", border: msg.role === "user" ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--shield-gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {msg.role === "user" ? <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#fff" }}>YOU</span> : <Bot size={20} color="var(--shield-gold)" />}
                </div>

                <div>
                  <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--shield-silver)", marginBottom: "4px", letterSpacing: "0.1em", textAlign: msg.role === "user" ? "right" : "left" }}>
                    {msg.role === "user" ? "FIELD AGENT" : "S.H.I.E.L.D. MENTOR AI"}
                  </div>
                  <div style={{ 
                    background: msg.role === "user" ? "var(--shield-gold)" : "rgba(17,24,39,0.8)", 
                    border: msg.role === "user" ? "none" : "1px solid var(--shield-border)", 
                    padding: "16px", 
                    borderRadius: msg.role === "user" ? "12px 0 12px 12px" : "0 12px 12px 12px", 
                    fontSize: "0.9rem", 
                    color: msg.role === "user" ? "#000" : "var(--shield-white)", 
                    lineHeight: 1.6, 
                    backdropFilter: msg.role === "user" ? "none" : "blur(4px)",
                    whiteSpace: "pre-wrap"
                  }}>
                    {msg.content}
                  </div>
                </div>

              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", gap: "16px", maxWidth: "80%" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(245,166,35,0.15)", border: "1px solid var(--shield-gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bot size={20} color="var(--shield-gold)" />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--shield-silver)", marginBottom: "4px", letterSpacing: "0.1em" }}>S.H.I.E.L.D. MENTOR AI</div>
                  <div style={{ background: "rgba(17,24,39,0.8)", border: "1px solid var(--shield-border)", padding: "16px", borderRadius: "0 12px 12px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--shield-gold)", borderRadius: "50%", animation: "blink 1s infinite 0s" }} />
                    <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--shield-gold)", borderRadius: "50%", animation: "blink 1s infinite 0.2s" }} />
                    <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--shield-gold)", borderRadius: "50%", animation: "blink 1s infinite 0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: "20px 32px", borderTop: "1px solid var(--shield-border)", background: "var(--shield-black)" }}>
            {!documentContext && (
               <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--shield-gold)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                 <AlertTriangle size={14} /> WARNING: No mission context provided. Responses will be generic.
               </div>
            )}
            <form onSubmit={handleSend} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  className="shield-input"
                  placeholder="Ask a question about the material (Shift+Enter for newline)..."
                  style={{ minHeight: "56px", padding: "16px", fontSize: "0.9rem", resize: "none", display: "block" }}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="btn-gold" 
                style={{ height: "56px", padding: "0 24px", opacity: (isLoading || !input.trim()) ? 0.5 : 1, cursor: (isLoading || !input.trim()) ? "not-allowed" : "pointer", flexShrink: 0 }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
