  import ChatUI from '../components/ChatUI';
  import { MessageSquare } from 'lucide-react';

  export default function Home() {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <MessageSquare size={28} className="text-blue-500" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Groq Chatbot
            </h1>
          </div>
          <ChatUI />
        </div>
      </main>
    );
  }