"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Client, Conversation, Message } from '@twilio/conversations';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const chatClient = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatClient.current) {
      initChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/twilio/token');
      const data = await response.json();
      
      const client = new Client(data.token);
      chatClient.current = client;

      client.on('stateChanged', (state) => {
        if (state === 'failed') {
          setIsConnecting(false);
          return;
        }
      });

      // Join or create a general conversation for this user
      // In a real support scenario, you'd likely connect to a specific support channel
      // or create a new unique conversation for the session.
      try {
        let conv;
        try {
           conv = await client.getConversationByUniqueName('support_' + data.identity);
        } catch (e) {
           conv = await client.createConversation({ uniqueName: 'support_' + data.identity, friendlyName: 'Support Chat' });
           await conv.join();
        }
        
        setConversation(conv);
        
        // Load existing messages
        const existingMessages = await conv.getMessages();
        setMessages(existingMessages.items);

        // Listen for new messages
        conv.on('messageAdded', (message: Message) => {
          setMessages((prev) => [...prev, message]);
        });
      } catch (e) {
        console.error('Error setting up conversation:', e);
      }

      setIsConnecting(false);
    } catch (error) {
      console.error('Twilio Chat init error:', error);
      setIsConnecting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversation) return;

    try {
      await conversation.sendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-neutral-900 p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-medium">SimpliFire Support</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {isConnecting ? (
                <div className="flex h-full items-center justify-center text-neutral-400">
                  <Loader2 className="animate-spin mr-2" />
                  <span>Connecting...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <MessageCircle size={40} className="mb-2 opacity-20" />
                  <p className="text-sm">Hello! How can we help you today?</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.author.startsWith('user') || msg.author.startsWith('guest') ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.author.startsWith('user') || msg.author.startsWith('guest')
                        ? 'bg-neutral-900 text-white rounded-tr-none'
                        : 'bg-white text-neutral-900 border border-neutral-100 rounded-tl-none'
                    }`}>
                      {msg.body}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-neutral-100 p-4 bg-white flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                disabled={isConnecting || !conversation}
                className="flex-1 text-sm outline-none disabled:bg-transparent"
              />
              <button
                type="submit"
                disabled={isConnecting || !conversation || !inputValue.trim()}
                className="rounded-full p-2 text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
