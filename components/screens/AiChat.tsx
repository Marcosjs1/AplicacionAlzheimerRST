import React, { useState, useEffect, useRef } from 'react';
import { streamMessage } from '../../services/geminiService';
import { BackHeader, BottomNav } from '../Layout';
import { Message } from '../../types';

export const AiChatScreen: React.FC = () => {
    const userName = localStorage.getItem('userName') || 'María';
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            role: 'model',
            text: `Hola, ${userName}. Soy Aida, tu asistente personal. ¿En qué puedo ayudarte hoy? Podemos charlar, recordar algo juntas o puedo sugerirte una actividad.`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const modelMsgId = (Date.now() + 1).toString();
        // Placeholder for streaming
        setMessages(prev => [...prev, {
            id: modelMsgId,
            role: 'model',
            text: '',
            timestamp: new Date()
        }]);

        try {
            const stream = streamMessage(userMsg.text);
            let fullText = '';
            let hasError = false;
            
            for await (const chunk of stream) {
                if (chunk.startsWith("QUOTA_EXCEEDED: ")) {
                    hasError = true;
                    fullText = chunk.replace("QUOTA_EXCEEDED: ", "");
                    break;
                }
                if (chunk.startsWith("ERROR: ")) {
                    hasError = true;
                    fullText = chunk.replace("ERROR: ", "");
                    break;
                }
                fullText += chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelMsgId ? { ...msg, text: fullText } : msg
                ));
            }

            if (hasError) {
                setMessages(prev => prev.map(msg => 
                    msg.id === modelMsgId ? { ...msg, text: fullText, isError: true } : msg
                ));
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.map(msg => 
                msg.id === modelMsgId ? { ...msg, text: "Error de conexión. Intentá de nuevo.", isError: true } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 flex flex-col md:pb-6 md:pl-64">
            <BackHeader title="Hablar con Aida" />
            
            <main className="flex-1 flex flex-col overflow-hidden w-full max-w-5xl mx-auto bg-white/50 dark:bg-black/20 md:border-x md:border-gray-200 md:dark:border-gray-800">
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] sm:max-w-[75%] p-5 rounded-3xl shadow-sm text-lg leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-tr-sm' 
                                    : msg.isError 
                                        ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-tl-sm border border-red-200 dark:border-red-800'
                                        : 'bg-white dark:bg-[#2a3c2e] text-slate-800 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-gray-800'
                            }`}>
                                {msg.role === 'model' && (
                                    <div className="flex items-center gap-2 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm text-primary">smart_toy</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Aida (IA)</span>
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                         <div className="flex justify-start">
                            <div className="bg-white dark:bg-[#2a3c2e] p-4 rounded-3xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white dark:bg-[#1a2e1d] border-t border-gray-200 dark:border-gray-800 w-full">
                    <div className="flex items-end gap-3 max-w-5xl mx-auto">
                        <div className="flex-1 bg-gray-100 dark:bg-[#102213] rounded-[2rem] border-2 border-transparent focus-within:border-primary focus-within:bg-white dark:focus-within:bg-[#0c1a0e] transition-all">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe un mensaje..."
                                className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[56px] max-h-32 resize-none text-lg"
                                rows={1}
                            />
                        </div>
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`size-14 rounded-full flex items-center justify-center transition-all ${
                                input.trim() && !isLoading 
                                    ? 'bg-primary text-white shadow-lg active:scale-95 hover:bg-primary-dark' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <span className="material-symbols-outlined text-2xl">send</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};