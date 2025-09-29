"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";

interface FileAnalysisProps {
  fileId: string;
}

interface Metadata {
  summary: string;
  keywords: string[];
  topics: string[];
  wordCount: number;
  caption?: string;
  labels?: string[];
  detectedText?: string;
  dominantColors?: string[];
  safety?: string;
}

export default function FileAnalysis({ fileId }: FileAnalysisProps) {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [quickSummary, setQuickSummary] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        setLoading(true);
        const res = await fetch(`/api/files/${fileId}/analyze`, {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "failed to fetch analysis");

        setMetadata(data.metadata);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [fileId]);

  const handleSummarize = async () => {
    try {
      setSummarizing(true);
      const res = await fetch(`/api/files/${fileId}/summarize`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to summarize");

      setQuickSummary(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm">analyzing document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-red-500 bg-red-50">
        <CardHeader>
          <CardTitle>Analysis failed</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  if (!metadata) return null;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            AI Analysis Results
          </CardTitle>
          <Button
            onClick={handleSummarize}
            disabled={summarizing}
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {summarizing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {summarizing ? "Analyzing..." : "📄 Quick Summary"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {quickSummary && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
              <h3 className="font-bold text-lg text-green-800 mb-3 flex items-center">
                AI Summary
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-green-700 leading-relaxed whitespace-pre-wrap text-sm">{quickSummary}</p>
              </div>
            </div>
          )}

          {metadata.caption && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-lg mb-2 flex items-center text-orange-800">
                Caption
              </h3>
              <p className="text-orange-700">{metadata.caption}</p>
            </div>
          )}

          {metadata.summary && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center text-gray-800">
                Detailed Summary
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed text-sm">{metadata.summary}</p>
              </div>
            </div>
          )}

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-lg mb-3 flex items-center text-purple-800">
              Keywords & Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {(metadata.keywords || metadata.labels || []).map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full border border-purple-200 font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {metadata.topics && metadata.topics.length > 0 && (
            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center text-cyan-800">
                Topics
              </h3>
              <ul className="space-y-1">
                {metadata.topics.map((topic, i) => (
                  <li key={i} className="flex items-center text-cyan-700">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {metadata.detectedText && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center text-yellow-800">
                Detected Text (OCR)
              </h3>
              <p className="text-yellow-700 whitespace-pre-wrap text-sm bg-white p-3 rounded border">{metadata.detectedText}</p>
            </div>
          )}

          {metadata.dominantColors && metadata.dominantColors.length > 0 && (
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center text-pink-800">
                Dominant Colors
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                {metadata.dominantColors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="inline-block h-6 w-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: c }} />
                    <span className="text-sm font-mono text-pink-700">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {typeof metadata.wordCount === 'number' && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-lg mb-2 flex items-center text-indigo-800">
                Word Count
              </h3>
              <p className="text-2xl font-bold text-indigo-600">{metadata.wordCount.toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
