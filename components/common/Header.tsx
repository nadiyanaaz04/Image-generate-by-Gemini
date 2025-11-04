import React from 'react';

type Tab = 'chat' | 'analyze' | 'image';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'chat', label: 'Chat Bot' },
    { id: 'analyze', label: 'Analyze & Edit' },
    { id: 'image', label: 'Image Creator' },
  ];

  return (
    <nav className="flex justify-center space-x-2 md:space-x-4 p-2 bg-gray-800 rounded-lg shadow-md">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-3 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Header;
