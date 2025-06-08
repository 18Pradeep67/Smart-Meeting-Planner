import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle, X } from 'lucide-react';
import PostSlotsTab from './components/PostSlotsTab';
import SuggestTab from './components/SuggestTab';
import CalendarTab from './components/CalendarTab';

type Tab = 'post-slots' | 'suggest' | 'calendar';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('post-slots');

  const tabs = [
    { id: 'post-slots' as Tab, label: 'Post Slots', icon: Plus },
    { id: 'suggest' as Tab, label: 'Suggest', icon: Clock },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Scheduling Assistant
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your time slots, get suggestions, and view calendars
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all duration-200 relative ${
                    index === 0 ? 'rounded-l-xl' : ''
                  } ${
                    index === tabs.length - 1 ? 'rounded-r-xl' : ''
                  } ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
          {activeTab === 'post-slots' && <PostSlotsTab />}
          {activeTab === 'suggest' && <SuggestTab />}
          {activeTab === 'calendar' && <CalendarTab />}
        </div>
      </div>
    </div>
  );
}

export default App;