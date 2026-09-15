import { useEffect, useRef, useState } from 'react';
import { sendStudyQuestion, type ChatMessage } from '../../services/groqService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Icon } from '../icons/Icon';
import { showToast } from '../../state/toastStore';
import './StudyChatbot.css';

const STORAGE_KEY = 'aers_study_chat_v2';

const INITIAL_GREETING: ChatMessage = {
  id: 'init-msg-1',
  role: 'assistant',
  timestamp: Date.now(),
  content: `Hi! I'm your AI Study Mentor. Ask me any study question, coding problem, engineering doubt, or interview prep tip.`,
};

export function StudyChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [INITIAL_GREETING];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat log on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  // Persist messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const replyText = await sendStudyQuestion(messages, textToSend);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
      };
      setMessages([...newHistory, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${
          err?.message || 'Unable to connect to AI study service right now. Please try again.'
        }`,
        timestamp: Date.now(),
      };
      setMessages([...newHistory, errorMessage]);
      showToast('Error getting AI response', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyAnswer = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Could not copy', 'error');
    }
  };

  return (
    <div className="study-bot">
      {/* Chat Messages Feed — Pure User Messages & AI Responses */}
      <div className="study-bot__messages" ref={chatContainerRef}>
        {messages.map((m) => {
          const isMe = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`study-bot__item ${
                isMe ? 'study-bot__item--user' : 'study-bot__item--ai'
              }`}
            >
              {isMe ? (
                /* User Message in Bubble */
                <div className="study-bot__user-bubble">
                  <p>{m.content}</p>
                </div>
              ) : (
                /* AI Reply (Not in bubble — clean direct text) */
                <div className="study-bot__ai-reply">
                  <div className="study-bot__ai-content">
                    <MarkdownRenderer content={m.content} />
                  </div>
                  <div className="study-bot__ai-actions">
                    <button
                      className="study-bot__copy-action"
                      onClick={() => copyAnswer(m.content)}
                      type="button"
                      title="Copy response"
                    >
                      <Icon name="share" size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="study-bot__item study-bot__item--ai">
            <div className="study-bot__ai-reply">
              <div className="study-bot__typing">
                <span className="study-bot__typing-dot" />
                <span className="study-bot__typing-dot" />
                <span className="study-bot__typing-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Minimal Input Bar */}
      <div className="study-bot__input-bar">
        <form
          className="study-bot__form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask a study question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="study-bot__input"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="study-bot__send"
            aria-label="Send"
          >
            <Icon name="arrow-right" size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
