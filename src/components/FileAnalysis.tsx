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
        <CardTitle>AI Document Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Summary</h3>
          <p className="text-muted-foreground">{metadata.summary}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {metadata.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-1 text-sm bg-primary/10 rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Topics</h3>
          <ul className="list-disc list-inside text-muted-foreground">
            {metadata.topics.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Word count</h3>
          <p className="text-muted-foreground">{metadata.wordCount}</p>
        </div>
      </CardContent>
    </Card>
  );
}
