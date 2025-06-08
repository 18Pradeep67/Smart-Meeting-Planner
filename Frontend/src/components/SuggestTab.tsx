import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, X, CheckCircle } from 'lucide-react';

type TimeSlot = [string, string];

const API_URL = "http://127.0.0.1:8000";

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function toTime(mins: number) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

const SuggestTab: React.FC = () => {
  const [duration, setDuration] = useState(30);
  const [suggestions, setSuggestions] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [startTimePickers, setStartTimePickers] = useState<Record<number, number>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [bookingState, setBookingState] = useState<'confirm' | 'success' | 'error'>('confirm');
  const [bookingError, setBookingError] = useState('');

  const handleSuggest = async () => {
    setError('');
    setLoading(true);
    setSuggestions([]);
    setSelectedSlotIndex(null);
    setBookingState('confirm');
    setShowPopup(false);

    try {
      const response = await fetch(`${API_URL}/suggest?duration=${duration}`);

      if (response.ok) {
        const data: TimeSlot[] = await response.json();
        setSuggestions(data);

        const initialPickers: Record<number, number> = {};
        data.forEach((slot, i) => {
          initialPickers[i] = toMinutes(slot[0]);
        });
        setStartTimePickers(initialPickers);
      } else {
        setError('Failed to fetch suggestions. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const onStartChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setStartTimePickers(prev => ({
      ...prev,
      [index]: value,
    }));
  };

  const openPopup = (index: number) => {
    setSelectedSlotIndex(index);
    setBookingState('confirm');
    setBookingError('');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedSlotIndex(null);
    setBookingError('');
  };

  const confirmBooking = async () => {
    if (selectedSlotIndex === null) return;

    const selectedStart = startTimePickers[selectedSlotIndex];
    const selectedEnd = selectedStart + duration;
    const selectedSlot: TimeSlot = [toTime(selectedStart), toTime(selectedEnd)];

    try {
      const response = await fetch(`${API_URL}/book?duration=${duration}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot: selectedSlot }),
      });

      if (response.ok) {
        setBookingState('success');
        // Optionally refresh suggestions after booking:
        // handleSuggest();
      } else {
        const data = await response.json();
        setBookingState('error');
        setBookingError(data.detail || 'Unknown error');
      }
    } catch {
      setBookingState('error');
      setBookingError('Network error while booking.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Find & Book Time Slots</h2>

      <div className="flex items-center gap-3 mb-6">
        <label htmlFor="duration" className="font-medium text-gray-700">
          Duration (minutes):
        </label>
        <input
          id="duration"
          type="number"
          min={5}
          max={120}
          step={5}
          value={duration}
          onChange={e => setDuration(Math.max(5, Math.min(120, Number(e.target.value))))}
          className="w-20 border border-gray-300 rounded px-3 py-1"
        />
        <button
          onClick={handleSuggest}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          Get Suggestions
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded text-red-700 flex items-center gap-2">
          <X size={18} />
          <span>{error}</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select Start Time ({duration} mins)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Slot</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suggestions.map((slot, i) => {
                const [start, end] = slot;
                const slotStartMin = toMinutes(start);
                const slotEndMin = toMinutes(end);
                const maxStart = slotEndMin - duration;

                const selectedStart = startTimePickers[i] ?? slotStartMin;
                const selectedEnd = selectedStart + duration;

                const options = [];
                for (let t = slotStartMin; t <= maxStart; t += 5) {
                  options.push(t);
                }

                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 text-sm text-gray-900">
                      <Clock size={16} />
                      {start} - {end}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={selectedStart}
                        onChange={e => onStartChange(i, e)}
                      >
                        {options.map(opt => (
                          <option key={opt} value={opt}>
                            {toTime(opt)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {toTime(selectedStart)} - {toTime(selectedEnd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openPopup(i)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
                      >
                        <Calendar size={14} />
                        Book
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup modal */}
      {showPopup && selectedSlotIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>

            {bookingState === 'confirm' && (
              <>
                <h3 className="text-xl font-semibold mb-4">Confirm Booking</h3>
                <p className="mb-4">
                  Are you sure you want to book slot{' '}
                  <strong>
                    {toTime(startTimePickers[selectedSlotIndex])} -{' '}
                    {toTime(startTimePickers[selectedSlotIndex] + duration)}
                  </strong>
                  ?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closePopup}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {bookingState === 'success' && (
              <div className="text-center text-green-700">
                <CheckCircle size={48} className="mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Booking Confirmed!</h3>
                <p className="mb-6">Your slot has been successfully booked.</p>
                <button
                  onClick={() => {
                    closePopup();
                    handleSuggest();
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {bookingState === 'error' && (
              <div className="text-center text-red-700">
                <h3 className="text-xl font-semibold mb-2">Booking Failed</h3>
                <p className="mb-6">{bookingError}</p>
                <button
                  onClick={() => setBookingState('confirm')}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestTab;
