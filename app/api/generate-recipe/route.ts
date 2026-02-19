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
  const { hairType, skinType, condition, goal, detailedCondition, personalGoals } = await req.json()

  try {
    console.log("[v0] Using Google Gemini model, API key present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    const { output } = await generateText({
      model: google("gemini-2.0-flash"),
      output: Output.object({
        schema: recipeSchema,
      }),
      prompt: `You are a professional natural cosmetic formulator and herbal beauty expert with an elegant, empowering, and warm feminine tone.

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

Use an empowering, soft feminine tone. No clinical or medical claims. No harsh language.`,
    })

    return Response.json({ recipe: output })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate recipe"
    const isGatewayError = message.includes("credit card") || message.includes("AI Gateway")
    return Response.json(
      {
        error: isGatewayError
          ? "The AI Gateway requires account verification. Please add a credit card to your Vercel account to unlock free AI credits."
          : "Something went wrong while crafting your recipe. Please try again.",
      },
      { status: isGatewayError ? 403 : 500 }
    )
  }
}
