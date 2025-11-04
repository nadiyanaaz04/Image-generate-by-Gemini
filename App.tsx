import React, { useState } from 'react';
import Header from './components/common/Header';
import Chat from './components/Chat';
import AnalyzeEdit from './components/AnalyzeEdit';
import ImageCreator from './components/ImageCreator';

type Tab = 'chat' | 'analyze' | 'image';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat />;
      case 'analyze':
        return <AnalyzeEdit />;
      case 'image':
        return <ImageCreator />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col flex-grow">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            Gemini AI Suite
          </h1>
          <p className="text-gray-400 mt-2">Explore the power of Gemini across different tasks.</p>
        </header>

        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-grow bg-gray-800 bg-opacity-50 rounded-lg p-4 md:p-6 mt-4 shadow-2xl">
          {renderContent()}
        </main>
      </div>
       <footer className="text-center p-4 text-gray-500 text-sm">
          Powered by Google Gemini
       </footer>
    </div>
  );
};

export default App;
