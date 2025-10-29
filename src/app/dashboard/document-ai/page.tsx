"use client"

import { useState } from "react"
import { Search, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SearchResult {
  id: string
  content: string
  score: number
  metadata?: {
    filename?: string
    fileType?: string
    filesFound?: number
  }
}

export default function DocumentAIPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch("/api/document-ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })
      
      const data = await response.json()
      console.log("API Response:", data)
      setResults(data.results || [])
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8" />
        <h1 className="text-3xl font-semibold">Document AI Search</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Ask questions about your documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    {result.metadata?.filesFound && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {result.metadata.filesFound} files analyzed
                      </span>
                    )}
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  {result.content.split('\n').map((line, i) => {
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>
                    }
                    if (line.startsWith('#### ')) {
                      return <h4 key={i} className="text-base font-medium mt-3 mb-1">{line.replace('#### ', '')}</h4>
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>
                    }
                    if (line.startsWith('* ')) {
                      return <li key={i} className="ml-4 list-disc">{line.replace('* ', '')}</li>
                    }
                    if (line.trim() === '') {
                      return <br key={i} />
                    }
                    return <p key={i} className="mb-2">{line}</p>
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}