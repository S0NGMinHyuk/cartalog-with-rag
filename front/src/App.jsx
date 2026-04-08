import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Car, User, Upload, Send, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '안녕하세요! 현대자동차 카탈로그 어시스턴트입니다.\n궁금하신 차량의 PDF를 업로드하거나 질문을 남겨주세요.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/rag/upload`, formData);
      setMessages(prev => [...prev, { role: 'ai', content: `✅ '${file.name}' 분석 완료! 질문을 시작해보세요.` }]);
    } catch (err) {
      alert("업로드 실패!");
    } finally { setUploading(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat/send`, null, {
        params: { message: userMsg, model: 'gpt-4o' }
      });
      setMessages(prev => [...prev, { role: 'ai', content: res.data }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '오류가 발생했습니다.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo-area">
          <Car size={24} color="#007fa8" />
          <h1>CARTALOG <span>WITH RAG</span></h1>
        </div>
        <label className="upload-label">
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {uploading ? '분석 중...' : '카탈로그 업로드'}
          <input type="file" hidden onChange={handleUpload} accept=".pdf" />
        </label>
      </header>

      <main className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className={`avatar ${msg.role}`}>
              {msg.role === 'ai' ? <Car size={20} /> : <User size={20} />}
            </div>
            <div className="bubble">{msg.content}</div>
          </div>
        ))}
        {loading && <div className="message ai"><div className="bubble">AI가 답변을 생성하고 있습니다...</div></div>}
        <div ref={scrollRef} />
      </main>

      <footer className="input-footer">
        <form className="input-form" onSubmit={handleSend}>
          <input 
            type="text" className="text-input" value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 쏘나타의 주요 편의 사양은 무엇인가요?"
          />
          <button type="submit" className="send-btn" disabled={loading}>
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;