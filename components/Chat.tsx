import React, { useState, useRef, useEffect } from 'react';
// Fix: Rename imported `Chat` type to avoid name collision with the component.
import type { Chat as GeminiChat } from '@google/genai';
import { startChat } from '../services/geminiService';
import type { ChatMessage, Role } from '../types';
import LoadingSpinner from './common/LoadingSpinner';

const Chat: React.FC = () => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Fix: Use the renamed `GeminiChat` type.
    const chatSession = useRef<GeminiChat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatSession.current = startChat();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatSession.current) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        setHistory(prev => [...prev, userMessage, { role: 'model', parts: [{ text: '' }] }]);
        setIsLoading(true);
        setInput('');

        try {
            const stream = await chatSession.current.sendMessageStream({ message: input });

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.parts[0].text += chunkText;
                    }
                    return newHistory;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = {
                    role: 'model',
                    parts: [{ text: "Oops! Something went wrong. Please try again." }]
                };
                return newHistory;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
        const isUser = message.role === 'user';
        const bubbleClasses = isUser
            ? 'bg-indigo-600 self-end rounded-l-lg rounded-tr-lg'
            : 'bg-gray-700 self-start rounded-r-lg rounded-tl-lg';

        return (
            <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl p-3 my-2 shadow-md ${bubbleClasses}`}>
                    <p className="text-white whitespace-pre-wrap">{message.parts[0].text}</p>
                </div>
            </div>
        );
    };


    return (
        <div className="flex flex-col h-[65vh]">
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
                {history.length === 0 && (
                  <div className="text-center text-gray-400">Start a conversation with Gemini!</div>
                )}
                {history.map((msg, index) => (
                    <ChatBubble key={index} message={msg} />
                ))}
                {isLoading && history[history.length -1].role === 'model' && history[history.length-1].parts[0].text === '' && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 p-3 rounded-r-lg rounded-tl-lg">
                           <LoadingSpinner />
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Gemini anything..."
                    disabled={isLoading}
                    className="flex-grow p-3 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
            </form>
        </div>
    );
};

export default Chat;