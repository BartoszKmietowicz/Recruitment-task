import React, { useState } from 'react';

export default function App() {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">AI Code Reviewer</h1>
      <textarea
        className="w-full max-w-3xl h-64 p-4 bg-gray-800 text-sm font-mono rounded-lg mb-4"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your JavaScript or TypeScript code here..."
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Submit'}
      </button>
      {feedback && (
        <div className="max-w-3xl mt-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">AI Feedback:</h2>
          <pre className="whitespace-pre-wrap text-sm">{feedback}</pre>
        </div>
      )}
    </div>
  );
}
