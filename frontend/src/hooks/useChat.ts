import { useState, useRef, useCallback } from 'react';
import { sendToOpenRouter } from '@/lib/openrouter';


export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const { user } = useAuth();
  const { settings } = useSettings();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Check if user has API key configured
    if (!settings?.openRouterApiKey && !import.meta.env.VITE_OPENROUTER_API_KEY) {
      showError('Please configure your OpenRouter API key in settings');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiKey = settings?.openRouterApiKey || import.meta.env.VITE_OPENROUTER_API_KEY;
      const model = settings?.defaultModel || 'deepseek/deepseek-chat-v3';

      const chatMessages = [
        {
          role: 'system',
          content: `You are Dyad AI Assistant, a helpful and knowledgeable AI assistant. 
          You specialize in coding, content creation, and general knowledge. 
          Provide detailed, helpful responses and use markdown formatting for code blocks.
          Current user: ${user?.name || 'Guest'}`
        },
        ...messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content }
      ];

      const result = await sendToOpenRouter(apiKey, chatMessages, model);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result?.result?.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      showSuccess('Response received');
    } catch (error: any) {
      console.error('Chat error:', error);
      if (error.message?.includes('401')) {
        showError('Invalid API key. Please check your OpenRouter API key in settings.');
      } else if (error.message?.includes('Failed to fetch')) {
        showError('Network error. Please check your connection and try again.');
      } else {
        showError('Failed to get response from AI. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setConversationId(Date.now().toString());
   
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    conversationId
  };
};