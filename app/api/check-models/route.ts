import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"

export async function GET() {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 400 })
    }

    const candidateModels = [
      "gemini-2.0-flash",
      "gemini-2.0",
      "gemini-1.5-flash",
      "gemini-1.5",
      "models/text-bison-001",
      "text-bison-001",
    ]

    const results: Record<string, { ok: boolean; message?: string }>
      = {}

    for (const m of candidateModels) {
      try {
        const res = await generateText({
          model: google(m),
          prompt: "Say hi",
          output: Output.text(),
          // small timeout to fail fast
          timeout: 10_000,
        })
        results[m] = { ok: true, message: String(res.output || res) }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        results[m] = { ok: false, message: msg }
      }
    }

    return Response.json({ models: results })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return Response.json({ error: msg }, { status: 500 })
  }
}
