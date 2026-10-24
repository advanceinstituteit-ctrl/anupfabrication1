import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppStore } from '../../lib/store';
import { Bot, X, Send, Sparkles, AlertCircle, Wrench } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const { businessSettings, services } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते! मैं अनूप फैब्रिकेशन का तकनीकी सहायक हूँ। आप मेटल फैब्रिकेशन, गेट, ग्रिल, इंडस्ट्रियल शेड, साइट विजिट या कोटेशन प्रक्रिया के बारे में मुझसे पूछ सकते हैं।'
        : 'Hello! I am the technical fabrication assistant for Anup Fabrication. Ask me anything about custom metal work, boundary gates, structural steel sheds, or site quotation requirements in Delhi NCR.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      // Call server-side Gemini API proxy route
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text.trim(),
          language: language,
          business_context: {
            name: businessSettings.business_name,
            address: businessSettings.address,
            phones: businessSettings.phones,
            services: services.map(s => s.name_en)
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: data.reply || (language === 'hi' 
            ? 'कृपया विस्तृत जानकारी के लिए हमारी नजफगढ़ वर्कशॉप (7217853257 / 7838640423) पर संपर्क करें।' 
            : 'For exact specifications and on-site physical measurement, please contact our Najafgarh workshop desk directly at 7217853257.'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        // Fallback responsive reply if server key is not attached
        const fallbackReply = language === 'hi'
          ? `अनूप फैब्रिकेशन (31/1 नांगली सकरावती, नजफगढ़, नई दिल्ली) में सभी प्रकार के हैवी स्ट्रक्चरल शेड, गेट, ग्रिल एवं कस्टमाइज्ड वेल्डिंग का कार्य किया जाता है। अपनी आवश्यकता हेतु आप "कोटेशन अनुरोध" फॉर्म भर सकते हैं या सीधे 7217853257 पर कॉल कर सकते हैं।`
          : `Anup Fabrication (31/1 Nangli Sakrawati, Najafgarh, New Delhi) specializes in heavy structural steel, factory sheds, sliding gates, balcony railings, and custom metal engineering. You can submit dimensions via our "Request a Quote" form or call 7217853257.`;

        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: fallbackReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      const fallbackReply = language === 'hi'
        ? `अनूप फैब्रिकेशन दिल्ली एनसीआर में गेट, ग्रिल, इंडस्ट्रियल शेड और वेल्डिंग सेवाएं प्रदान करता है। सीधे परामर्श हेतु 7217853257 अथवा 7838640423 पर संपर्क करें।`
        : `Anup Fabrication provides structural fabrication, gates, grills, and industrial sheds across Delhi NCR. For immediate consultation, call our workshop at 7217853257 or 7838640423.`;

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer border border-amber-300"
          aria-label="Open Anup Fabrication AI Assistant"
        >
          <Bot className="w-5 h-5 text-slate-950" />
          <span className="text-xs tracking-wide">
            {language === 'hi' ? 'एआई सहायक' : 'Fabrication AI Assistant'}
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-[90vw] sm:w-[400px] h-[520px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{t('ai_assistant_title')}</span>
                  <span className="text-[10px] font-mono text-amber-400">Gemini 3.8</span>
                </h3>
                <span className="text-[10px] text-slate-400 block">{t('ai_assistant_sub')}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-200" />
                <span className="text-[11px] font-mono">Consulting fabrication guidelines...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 space-y-1.5">
              <div className="text-[10px] uppercase font-mono text-slate-500">Suggested Questions:</div>
              <button
                onClick={() => handleSendMessage(t('ai_suggest_1'))}
                className="w-full text-left text-[11px] text-slate-300 hover:text-amber-300 truncate cursor-pointer"
              >
                • {t('ai_suggest_1')}
              </button>
              <button
                onClick={() => handleSendMessage(t('ai_suggest_2'))}
                className="w-full text-left text-[11px] text-slate-300 hover:text-amber-300 truncate cursor-pointer"
              >
                • {t('ai_suggest_2')}
              </button>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={e => setInputPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder={t('ai_placeholder')}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputPrompt.trim()}
                className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-lg cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 mt-1.5 text-center leading-tight">
              {t('ai_disclaimer')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
