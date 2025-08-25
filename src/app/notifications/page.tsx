"use client"
import { useState } from 'react';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendMode, setSendMode] = useState<'all' | 'specific'>('all');
  const [token, setToken] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/send-fcm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: sendMode === 'specific' ? token : undefined,
          title, 
          body: message,
          sendToAll: sendMode === 'all'
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(sendMode === 'all' 
          ? `Notification sent to ${data.sentTo} devices!` 
          : 'Notification sent successfully!'
        );
        setTitle('');
        setMessage('');
        if (sendMode === 'specific') setToken('');
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      // Use the error parameter and provide more detailed error info
      console.error('Failed to send notification:', error);
      setResult(`Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setSending(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Send Push Notification</h1>
      
      <div className="mb-6 space-y-4">
        {/* Send Mode Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Send to:</label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="all"
                checked={sendMode === 'all'}
                onChange={e => setSendMode(e.target.value as 'all')}
                className="mr-2"
              />
              All registered devices
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="specific"
                checked={sendMode === 'specific'}
                onChange={e => setSendMode(e.target.value as 'specific')}
                className="mr-2"
              />
              Specific device
            </label>
          </div>
        </div>

        {/* Token input (only show if specific mode) */}
        {sendMode === 'specific' && (
          <input
            className="w-full border p-2 rounded"
            placeholder="Device FCM Token"
            value={token}
            onChange={e => setToken(e.target.value)}
          />
        )}
        
        {/* Title and Message */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Notification Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded h-20"
          placeholder="Notification Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          onClick={handleSend}
          disabled={sending || !title || !message || (sendMode === 'specific' && !token)}
        >
          {sending ? 'Sending...' : `Send to ${sendMode === 'all' ? 'All Devices' : 'Specific Device'}`}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-3 rounded ${result.includes('Error') || result.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  );
}
