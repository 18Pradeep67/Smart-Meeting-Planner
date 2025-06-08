import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

const testPayloads: Record<string, string> = {
  'Sample A': JSON.stringify(
    {
      users: [
        { id: 1, busy: [["09:00", "10:30"], ["13:00", "14:00"]] },
        { id: 2, busy: [["11:00", "12:00"], ["15:00", "16:00"]] }
      ]
    },
    null,
    2
  ),
  'Sample B': JSON.stringify(
    {
      users: [
        { id: 1, busy: [["09:00", "10:00"], ["12:00", "13:00"]] },
        { id: 2, busy: [["10:30", "11:30"], ["14:00", "15:00"]] }
      ]
    },
    null,
    2
  )
};

const PostSlotsTab: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const API_URL = "http://127.0.0.1:8000";

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    if (!jsonInput.trim()) {
      setError('Please enter JSON data.');
      return;
    }

    try {
      JSON.parse(jsonInput);
    } catch (e) {
      setError('Invalid JSON format. Please check your input.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput,
      });

      if (response.ok) {
        setSuccess(true);
        setJsonInput('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to post slots. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleSelect = (sampleName: string) => {
    setJsonInput(testPayloads[sampleName]);
    setDropdownOpen(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Post Time Slots</h2>
          <p className="text-gray-600 mb-2">
            Paste your JSON below (format: <code>{'{ users: [ { id, busy: [[HH:MM, HH:MM]] } ] }'}</code>) or select a test case.
          </p>

          {/* Dropdown */}
          <div className="relative inline-block text-left mb-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Load Sample JSON
              <ChevronDown size={16} className="ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 bg-white border border-gray-200 shadow-lg rounded w-60 z-10">
                {Object.keys(testPayloads).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSampleSelect(key)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* JSON Input */}
          <div>
            <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 mb-2">
              JSON Input
            </label>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{
  "users": [
    { "id": 1, "busy": [["09:00", "10:30"], ["13:00", "14:00"]] },
    { "id": 2, "busy": [["11:00", "12:00"], ["15:00", "16:00"]] }
  ]
}'
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <CheckCircle size={18} />
              <span>Slots posted successfully!</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !jsonInput.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {loading ? 'Posting...' : 'Post Slots'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSlotsTab;
