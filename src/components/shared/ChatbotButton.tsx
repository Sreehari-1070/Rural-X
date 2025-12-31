import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Sparkles, X, Send, Bot,
  Sprout, CloudSun, Droplets, Bug, Leaf, Image as ImageIcon, Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

type Message = {
  id: string;
  text?: string;
  image?: string; // URL for display
  sender: 'user' | 'bot';
  timestamp: Date;
};

const FARMING_TOPICS = [
  { label: 'Crop Advice', icon: Sprout, query: 'What crops should I grow?' },
  { label: 'Weather', icon: CloudSun, query: 'How is the weather affecting my farm?' },
  { label: 'Irrigation', icon: Droplets, query: 'Tips for efficient irrigation' },
  { label: 'Pest Control', icon: Bug, query: 'How to manage common pests?' },
];

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
};

export function ChatbotButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // History for Backend
  // We need to map our frontend messages to { role: 'user' | 'model', parts: [text] }
  const getBackendHistory = () => {
    return messages
      .filter(m => m.text) // Simple text history for now
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [m.text || ""]
      }));
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMsg: Message = {
        id: '1',
        text: `Hello ${user?.name || 'Farmer'}! I'm AgriPal 🌿, your personal farming assistant. How can I help you grow today?`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([initialMsg]);
    }
  }, [isOpen, user?.name]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping, previewUrl]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (text?: string) => {
    const msgText = text || inputValue;
    if (!msgText.trim() && !selectedImage) return;

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      text: msgText,
      image: previewUrl || undefined,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Clear preview but keep valid reference for sending if needed, 
    // actually we need to send it now.
    const imageToSend = selectedImage;
    clearImage(); // Clear UI state immediately

    try {
      let botResponseText = "";

      if (imageToSend) {
        // Image Analysis Flow
        const formData = new FormData();
        formData.append('file', imageToSend);
        if (msgText) formData.append('prompt', msgText);
        else formData.append('prompt', "Analyze this agricultural image.");

        const res = await fetch('http://localhost:8001/ai/analyze', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        botResponseText = data.response;

      } else {
        // Chat Flow
        const history = getBackendHistory();
        // Add current message to history context for this call if backend expects it in history 
        // or just send as message. Our backend takes message + history.
        // History should NOT include the current message we are sending effectively, 
        // but typically one appends it. Let's rely on backend to just take 'message' as current 
        // and 'history' as context.

        const res = await fetch('http://localhost:8001/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msgText, history: history })
        });
        const data = await res.json();
        botResponseText = data.response;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to the farm server. Please check your connection.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-4 z-50 flex h-[600px] max-h-[80vh] w-[90vw] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-[#F5F7F6] shadow-2xl md:right-6 md:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#10B981] px-4 py-3 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AgriPal AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-200/60 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4ADE80] border border-[#10B981]"></span>
                    </span>
                    <p className="text-xs font-medium text-green-50">Online & Smart</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${msg.sender === 'user'
                        ? 'bg-[#10B981] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                        }`}
                    >
                      {msg.image && (
                        <img src={msg.image} alt="User upload" className="mb-2 max-w-full rounded-lg border border-white/20" />
                      )}

                      {msg.text && (
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                          {msg.sender === 'bot' && index === messages.length - 1 && !isTyping ? (
                            <TypewriterText text={msg.text} />
                          ) : (
                            msg.text
                          )}
                        </p>
                      )}

                      <span className={`mt-1.5 block text-[10px] font-medium ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'
                        }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-gray-100 bg-white px-5 py-4 shadow-sm">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#10B981]/60 [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#10B981]/60 [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#10B981]/60"></span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Suggestions */}
            {messages.length < 3 && !isTyping && (
              <div className="px-4 py-2">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {FARMING_TOPICS.map((topic) => (
                    <button
                      key={topic.label}
                      onClick={() => handleSendMessage(topic.query)}
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#10B981]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#10B981] shadow-sm transition-all hover:bg-[#10B981] hover:text-white"
                    >
                      <topic.icon className="h-3.5 w-3.5" />
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="bg-white p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              {/* Image Preview */}
              {selectedImage && (
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                  <img src={previewUrl!} alt="Preview" className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1 truncate text-xs text-gray-500">{selectedImage.name}</div>
                  <button onClick={clearImage} className="text-gray-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="relative flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#10B981] transition-colors"
                  title="Upload Image"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedImage ? "Describe this image..." : "Ask anything about farming..."}
                    disabled={isTyping}
                    className="w-full rounded-full border border-gray-200 bg-gray-50 pl-5 pr-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/10 disabled:opacity-60"
                  />
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={(!inputValue.trim() && !selectedImage) || isTyping}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#10B981] text-white shadow-md transition-all hover:bg-[#059669] hover:scale-105 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:scale-100"
                >
                  {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#10B981] to-[#34D399] shadow-lg shadow-green-500/40 transition-all duration-300 hover:scale-110 ${isOpen ? 'rotate-90 scale-0 opacity-0' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-white/20"
        />
        <div className="relative flex items-center justify-center">
          <Leaf className="h-8 w-8 text-white fill-white" />
          <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white"></div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            onClick={() => setIsOpen(false)}
            className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-white border border-gray-200 shadow-xl text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
