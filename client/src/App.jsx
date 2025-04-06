import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeInput from './CodeInput';

export default function App() {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentInputs, setRecentInputs] = useState([]);

  // Load the last 5 inputs from localStorage on component mount
  useEffect(() => {
    const storedInputs = JSON.parse(localStorage.getItem('recentInputs')) || [];
    setRecentInputs(storedInputs);
  }, []);

  // Function to handle submitting code
  const handleSubmit = async () => {
    const trimmedCode = code.trim();
    console.log('Submitting code to backend:', trimmedCode);

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmedCode }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log('Feedback received:', data); // Log the response

      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        console.error('No feedback received');
      }

      setLoading(false);

      // Update recent inputs array
      const newInputs = [trimmedCode, ...recentInputs];
      const limitedInputs = newInputs.slice(0, 5);
      localStorage.setItem('recentInputs', JSON.stringify(limitedInputs));
      setRecentInputs(limitedInputs);
    } catch (error) {
      console.error('Error submitting code:', error);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">AI Code Reviewer</h1>
    
    <div className="flex flex-col sm:flex-row items-start justify-between w-full max-w-3xl">
        <div className="w-full sm:w-2/3 lg:w-3/4 mb-6">
            {/* Code Input */}
            <CodeInput code={code} setCode={setCode} />
            <button
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold w-full sm:w-auto"
                onClick={handleSubmit}
                disabled={loading}
                style={{ minWidth: '150px' }}  // Set a min-width to prevent resizing
            >
                {loading ? (
                    <span className="inline-block">
                        Analyzing
                        <span className="animate-dot ellipsis">.</span>
                    </span>
                ) : (
                    'Submit'
                )}
            </button>
        </div>

        <div className="w-full sm:w-2/3 lg:w-3/4 mt-6 sm:mt-0 sm:ml-6">
            {recentInputs.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg w-full h-full overflow-auto shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Recent Code Inputs:</h2>
                    <ul className="list-disc pl-6 space-y-4 overflow-auto max-h-[300px]">
                        {recentInputs.map((input, index) => (
                            <li key={index} className="text-sm text-gray-300">
                                {input.length > 100 ? `${input.slice(0, 100)}...` : input}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>

    {feedback && (
        <div className="max-w-full sm:max-w-3xl mt-6 bg-gray-800 p-4 rounded-lg w-full sm:w-auto">
            <h2 className="text-xl font-semibold mb-2">AI Feedback:</h2>
            <pre className="whitespace-pre-wrap break-words">{feedback}</pre>
        </div>
    )}
</div>


  );
} 
