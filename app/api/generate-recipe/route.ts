import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const recipeSchema = z.object({
  productName: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
      benefit: z.string(),
    })
  ),
  preparation: z.array(z.string()),
  application: z.string(),
  frequency: z.string(),
  warnings: z.string(),
})

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { hairType, skinType, condition, goal, detailedCondition, personalGoals } = body

    console.log("[API] Received request:", { hairType, skinType, condition, goal, detailedCondition: !!detailedCondition, personalGoals: !!personalGoals })
    console.log("[API] GOOGLE_GENERATIVE_AI_API_KEY present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[API] Missing GOOGLE_GENERATIVE_AI_API_KEY")
      return Response.json(
        { error: "AI service is not configured. Please check API key setup." },
        { status: 500 }
      )
    }

    // Try a list of candidate models and use the first that succeeds.
    const candidateModels = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "models/text-bison-001",
      "text-bison-001",
    ]

    let output: any = null
    let lastError: unknown = null

    const prompt = `You are a professional natural cosmetic formulator and herbal beauty expert with an elegant, empowering, and warm feminine tone.

Create a safe, homemade beauty recipe based on the following user profile:

Hair Type: ${hairType}
Skin Type: ${skinType}
Current Condition: ${condition}
Goal: ${goal}
${detailedCondition ? `Detailed Description: ${detailedCondition}` : ''}
${personalGoals ? `Personal Goals: ${personalGoals}` : ''}

Requirements:
- Use only natural, commonly accessible ingredients
- Avoid unsafe combinations
- Give the product a luxurious, elegant name
- Provide:
  1. Product Name (creative, luxurious sounding)
  2. Ingredients with measurements
  3. Why each ingredient works (written elegantly)
  4. Step-by-step preparation instructions
  5. How to apply
  6. Frequency of use
  7. Safety warnings (if needed, written gently)

Use an empowering, soft feminine tone. No clinical or medical claims. No harsh language.`

    for (const modelId of candidateModels) {
      try {
        console.log(`[API] Trying model: ${modelId}`)
        const res = await generateText({
          model: google(modelId),
          output: Output.object({ schema: recipeSchema }),
          prompt,
        })
        output = res.output
        console.log(`[API] Model succeeded: ${modelId}`)
        break
      } catch (err) {
        console.warn(`[API] Model failed: ${modelId}`, err instanceof Error ? err.message : err)
        lastError = err
        continue
      }
    }

    if (!output) {
      console.error('[API] No models succeeded. Last error:', lastError)
      throw new Error('No supported model available for text generation. Please check your API and available models.')
    }

    console.log("[API] Successfully generated recipe:", output.productName)
    return Response.json({ recipe: output })
  } catch (error) {
    console.error("[API] Error generating recipe:", error)
    const message = error instanceof Error ? error.message : "Failed to generate recipe"
    const isGatewayError = message.includes("credit card") || message.includes("AI Gateway") || message.includes("quota")

    return Response.json(
      {
        error: isGatewayError
          ? "The AI service requires account verification. Please check your API key and billing setup."
          : `Something went wrong while crafting your recipe: ${message}`,
      },
      { status: isGatewayError ? 403 : 500 }
    )
  }
}
