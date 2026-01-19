"use client";

import { useState } from "react";

interface Subscription {
  service: string;
  billingHint: string;
  amount: string | null;
  date: string;
  originalSubject: string;
}

interface ScanResult {
  found: number;
  saved: number;
  skipped: number;
  subscriptions: Subscription[];
}

export default function EmailIngestionPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleScan = async () => {
    setIsScanning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/email/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to scan emails");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📧</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Email Ingestion
              </h1>
              <p className="text-gray-600 text-sm">
                Scan your Gmail for subscription receipts
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We scan your emails for subscription receipts</li>
              <li>• Only subscription-related emails are processed</li>
              <li>• Your email content is never stored</li>
            </ul>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Scanning emails...
              </>
            ) : (
              <>
                <span>📧</span>
                Scan Emails
              </>
            )}
          </button>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold text-green-900">
                    Scan Complete
                  </h3>
                  <p className="text-sm text-green-800 mt-1">
                    Found {result.found} subscription
                    {result.found !== 1 ? "s" : ""}.
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    <span className="font-semibold">{result.saved}</span> saved
                    to your dashboard,{" "}
                    <span className="font-semibold">{result.skipped}</span>{" "}
                    duplicates skipped.
                  </p>
                  {result.subscriptions.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {result.subscriptions.map((sub, index) => (
                        <div
                          key={index}
                          className="bg-white border border-green-100 rounded-md p-3 flex justify-between items-center shadow-sm"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {sub.service}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sub.billingHint} •{" "}
                              {new Date(sub.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            {sub.amount ? (
                              <span className="font-bold text-gray-900">
                                {sub.amount}
                              </span>
                            ) : (
                              <span className="text-xs italic text-gray-400">
                                Amount not found
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <h3 className="font-semibold text-red-900">Scan Failed</h3>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
