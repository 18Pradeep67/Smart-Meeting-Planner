import React, { useState } from 'react';
import { User, Calendar, Clock, Search } from 'lucide-react';

type TimeSlot = [string, string];

interface CalendarData {
  busy: TimeSlot[];
  booked: TimeSlot[];
}

const CalendarTab: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = "http://127.0.0.1:8000";

  const handleSearch = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/calendar/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCalendarData(data);
      } else {
        setError('Failed to fetch calendar data. Please check the user ID.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const renderTimeSlots = (slots: TimeSlot[], title: string, bgColor: string, textColor: string) => {
    if (slots.length === 0) {
      return (
        <div className={`${bgColor} rounded-lg p-4`}>
          <h4 className={`text-sm font-medium ${textColor} mb-2`}>{title}</h4>
          <p className="text-sm text-gray-500">No {title.toLowerCase()} slots</p>
        </div>
      );
    }

    return (
      <div className={`${bgColor} rounded-lg p-4`}>
        <h4 className={`text-sm font-medium ${textColor} mb-3`}>
          {title} ({slots.length})
        </h4>
        <div className="space-y-2">
          {slots.map((slot, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-gray-400" />
              <span className="font-medium">
                {formatTime(slot[0])} - {formatTime(slot[1])}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Calendar View</h2>
          <p className="text-gray-600">
            View busy and booked time slots for any user.
          </p>
        </div>

        {/* User ID Input */}
        <div className="mb-8">
          <label htmlFor="user-id" className="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="user-id"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID (e.g., user123)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !userId.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={18} />
              )}
              {loading ? 'Loading...' : 'View Calendar'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <span>{error}</span>
          </div>
        )}

        {/* Calendar Data */}
        {calendarData && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Calendar for User: {userId}
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Busy Slots */}
                {renderTimeSlots(
                  calendarData.busy,
                  'Busy Slots',
                  'bg-red-50',
                  'text-red-800'
                )}

                {/* Booked Slots */}
                {renderTimeSlots(
                  calendarData.booked,
                  'Booked Slots',
                  'bg-blue-50',
                  'text-blue-800'
                )}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Busy:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {calendarData.busy.length} slot{calendarData.busy.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Booked:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {calendarData.booked.length} slot{calendarData.booked.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTab;