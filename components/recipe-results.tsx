"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Leaf, Clock, AlertTriangle, RefreshCw, Sparkles } from "lucide-react"

interface Ingredient {
  name: string
  amount: string
  benefit: string
}

interface Recipe {
  productName: string
  ingredients: Ingredient[]
  preparation: string[]
  application: string
  frequency: string
  warnings: string
}

interface RecipeResultsProps {
  recipe: Recipe
  onBack: () => void
  onRefine: () => void
  isRefining: boolean
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function RecipeResults({ recipe, onBack, onRefine, isRefining }: RecipeResultsProps) {
  return (
    <section className="min-h-screen px-6 py-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto flex flex-col gap-12"
      >
        {/* Back */}
        <motion.button
          variants={item}
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Start Over
        </motion.button>

        {/* Product Name Card */}
        <motion.div
          variants={item}
          className="relative p-10 rounded-2xl border border-accent/30 bg-card text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-accent/50" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-accent/50" />
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-sans">
            Your Bespoke Formula
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mt-4 text-balance">
            {recipe.productName}
          </h1>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {recipe.frequency}
            </span>
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-serif text-foreground">Ingredients</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {recipe.ingredients.map((ing, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                whileHover={{ y: -2 }}
                className="group p-5 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-sans font-medium text-foreground">
                    {ing.name}
                  </h3>
                  <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                    {ing.amount}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  {ing.benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Preparation Timeline */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-serif text-foreground">Preparation</h2>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            {recipe.preparation.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="relative pb-8 last:pb-0"
              >
                <div className="absolute -left-5 top-1 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                  <span className="text-[10px] font-sans font-medium text-accent">
                    {i + 1}
                  </span>
                </div>
                <p className="text-foreground font-sans leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application */}
        <motion.div variants={item} className="p-8 rounded-2xl bg-card border border-border">
          <h2 className="text-xl font-serif text-foreground mb-3">How to Apply</h2>
          <p className="text-muted-foreground font-sans leading-relaxed">
            {recipe.application}
          </p>
        </motion.div>

        {/* Warnings */}
        {recipe.warnings && recipe.warnings.trim() !== "" && (
          <motion.div
            variants={item}
            className="flex items-start gap-4 p-6 rounded-xl bg-accent/5 border border-accent/20"
          >
            <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-sans font-medium text-foreground mb-1">
                A Gentle Note
              </h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {recipe.warnings}
              </p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div variants={item} className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={onRefine}
            disabled={isRefining}
            className="flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full text-sm font-sans uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-40"
          >
            {isRefining ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Refine My Formula
              </>
            )}
          </button>
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
          >
            Create a New Recipe
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
