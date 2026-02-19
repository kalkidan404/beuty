"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Hero } from "@/components/hero"
import { BeautyForm } from "@/components/beauty-form"
import { RecipeResults } from "@/components/recipe-results"

type View = "hero" | "form" | "results"

interface Recipe {
  productName: string
  ingredients: { name: string; amount: string; benefit: string }[]
  preparation: string[]
  application: string
  frequency: string
  warnings: string
}

interface FormData {
  hairType: string
  skinType: string
  condition: string
  goal: string
  detailedCondition: string
  personalGoals: string
}

export default function Home() {
  const [view, setView] = useState<View>("hero")
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)

  const generateRecipe = useCallback(async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    setFormData(data)
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.error) {
        setError(json.error)
      } else if (json.recipe) {
        setRecipe(json.recipe)
        setView("results")
      }
    } catch {
      setError("Unable to connect. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRefine = useCallback(async () => {
    if (formData) {
      await generateRecipe(formData)
    }
  }, [formData, generateRecipe])

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onStart={() => setView("form")} />
          </motion.div>
        )}

        {view === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BeautyForm
              onSubmit={generateRecipe}
              onBack={() => setView("hero")}
              isLoading={isLoading}
              error={error}
            />
          </motion.div>
        )}

        {view === "results" && recipe && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RecipeResults
              recipe={recipe}
              onBack={() => {
                setRecipe(null)
                setView("form")
              }}
              onRefine={handleRefine}
              isRefining={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
