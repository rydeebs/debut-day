"use client";
import { useState } from "react";

interface Props {
  shareText: string;
}

export default function ShareModal({ shareText }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-brand-accent hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition"
      >
        📤 Share Results
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-brand-card border border-brand-border rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg mb-4">Share Your Result</h3>
            <pre className="bg-brand-dark rounded-lg p-4 text-sm text-gray-200 whitespace-pre-wrap font-mono mb-4 border border-brand-border">
              {shareText}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
                  copied
                    ? "bg-green-700 text-green-200"
                    : "bg-brand-accent hover:bg-orange-600 text-white"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy to Clipboard"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-brand-border text-gray-400 rounded-lg text-sm hover:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
