"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileAnalysis from "@/components/FileAnalysis";

export default function FileList({ files }: { files: any[] }) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleAnalyze = (id: string) => {
    setSelectedFileId(id);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between border p-3 rounded-lg"
        >
          <span className="font-medium">{file.name}</span>
          <Button
            onClick={() => handleAnalyze(file.id)}
            variant="outline"
            size="sm"
          >
            Analyze
          </Button>
        </div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Document Analysis</DialogTitle>
          </DialogHeader>
          {selectedFileId && <FileAnalysis fileId={selectedFileId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
