"use client";

import { useState } from "react";

interface Subscription {
  service: string;
  amount: string | null;
  billing: string;
  date: string;
}

interface ScanResult {
  found: number;
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
            <span className="text-4xl text-blue-600">📧</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Email Ingestion
              </h1>
              <p className="text-gray-600 text-sm">
                Scan receipts for subscriptions
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-800">
            <p className="font-semibold mb-1">Privacy First</p>
            <p>
              We only look for billing keywords. Your data is processed
              securely.
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            {isScanning ? "Scanning Gmail..." : "Scan My Emails"}
          </button>

          {result && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Results: {result.found} found
              </h3>
              <div className="space-y-3">
                {result.subscriptions.map((sub, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{sub.service}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                        {sub.billing}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">
                        {sub.amount || "$?.??"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(sub.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
