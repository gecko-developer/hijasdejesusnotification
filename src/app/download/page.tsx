'use client';
import React, { useState } from 'react';
import Head from 'next/head';

export default function DownloadPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + '/RFID_APP_2.1.1.apk');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Download · RFID App</title>
        <meta name="description" content="Download the RFID mobile app or embed a web app preview." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center py-8">
        <div className="w-full max-w-xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col gap-5 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13.5V15.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6.5 6.5C6.5 5.11929 7.61929 4 9 4H15C16.3807 4 17.5 5.11929 17.5 6.5V18.5C17.5 19.8807 16.3807 21 15 21H9C7.61929 21 6.5 19.8807 6.5 18.5V6.5Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M6.5 16.5H17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">RFID Scanner</h1>
                <p className="text-sm text-slate-500 mt-0.5">Fast, secure RFID detection</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mt-2">
              <div className="text-xs font-medium text-slate-500 mb-2">Latest version</div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">RFID_APP_2.1.1.apk</div>
                  <div className="text-xs text-slate-400 mt-0.5">Android · 48.3 MB · Signed build</div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <a
                    href="/RFID_APP_2.1.1.apk"
                    download
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4v12m0 0-3.5-3.5M12 16l3.5-3.5M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download
                  </a>
                  <button 
                    onClick={copyToClipboard}
                    className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8V5c0-1-.6-2-2-2h-4C8.6 3 8 4 8 5v3m8 0h-8m8 0h1c1.4 0 2.5 1.2 2.5 2.5v9c0 1.4-1.1 2.5-2.5 2.5H7c-1.4 0-2.5-1.1-2.5-2.5v-9C4.5 9.1 5.6 8 7 8h1" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 text-sm text-slate-600">
              <div className="font-medium mb-2">Installation guide:</div>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Android: Enable &quot;Unknown sources&quot; in security settings if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Windows: Requires .NET Framework 4.7.2 or later</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Share this app via the direct link
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}