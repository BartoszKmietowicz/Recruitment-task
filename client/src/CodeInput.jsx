import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserTypescript from 'prettier/parser-typescript';
import { Copy, Sun, Moon, Wand2 } from 'lucide-react';

export default function CodeInput({ code, setCode }) {
  const [theme, setTheme] = useState('vs-dark');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-white text-lg font-semibold">Your Code</label>
        <div className="flex gap-3 items-center">
          <button
            onClick={handleCopy}
            className="flex items-center text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            <Copy size={16} className="mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            {theme === 'vs-dark' ? (
              <>
                <Sun size={16} className="mr-1" /> Light
              </>
            ) : (
              <>
                <Moon size={16} className="mr-1" /> Dark
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg bg-gray-900">
        <Editor
          height="400px"
          language="javascript"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme={theme}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            formatOnType: true,
            formatOnPaste: true,
            tabSize: 2,
            lineNumbers: 'on',
          }}
          onMount={(editor) => {
            editor.onKeyDown((e) => handleKeyDown(e));
          }}
        />
      </div>
    </div>
  );
}
