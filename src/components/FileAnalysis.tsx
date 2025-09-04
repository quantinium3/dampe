"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metadata.caption && (
          <div>
            <h3 className="font-semibold text-lg">Caption</h3>
            <p className="text-muted-foreground">{metadata.caption}</p>
          </div>
        )}

        {metadata.summary && (
          <div>
            <h3 className="font-semibold text-lg">Summary</h3>
            <p className="text-muted-foreground">{metadata.summary}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {(metadata.keywords || metadata.labels || []).map((kw, i) => (
              <span
                key={i}
                className="px-2 py-1 text-sm bg-primary/10 rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {metadata.topics && metadata.topics.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg">Topics</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {metadata.topics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>
        )}

        {metadata.detectedText && (
          <div>
            <h3 className="font-semibold text-lg">Detected Text (OCR)</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{metadata.detectedText}</p>
          </div>
        )}

        {metadata.dominantColors && metadata.dominantColors.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg">Dominant Colors</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {metadata.dominantColors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded" style={{ backgroundColor: c }} />
                  <span className="text-xs text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {typeof metadata.wordCount === 'number' && (
          <div>
            <h3 className="font-semibold text-lg">Word count</h3>
            <p className="text-muted-foreground">{metadata.wordCount}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
