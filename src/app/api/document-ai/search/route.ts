import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/autorag/rags/nexus/ai-search`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLOUDFLARE_AI_SEARCH_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const data = await response.json()
    console.log("AutoRAG full response:", JSON.stringify(data, null, 2))
    console.log("Response status:", response.status)
    
    if (!data.success && data.errors) {
      return NextResponse.json({
        results: [{
          id: "1",
          content: `Error: ${data.errors[0]?.message || 'AutoRAG request failed'}`,
          score: 0,
          metadata: { source: "AutoRAG Error", query }
        }],
        success: false,
        error: data.errors[0]?.message
      })
    }
    
    return NextResponse.json({
      results: [{
        id: "1",
        content: data.result?.response || "AutoRAG processed your query but returned no content",
        score: 1.0,
        metadata: { 
          source: "AutoRAG", 
          query,
          filesFound: data.result?.data?.length || 0
        }
      }],
      success: true
    })
  } catch (error) {
    console.error("AutoRAG search error:", error)
    return NextResponse.json({ 
      error: "Search failed", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}