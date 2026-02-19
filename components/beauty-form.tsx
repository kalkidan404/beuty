"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles, Flower2, Droplets, Heart, Target } from "lucide-react"

const HAIR_TYPES = ["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick"]
const SKIN_TYPES = ["Normal", "Oily", "Dry", "Combination", "Sensitive", "Mature"]
const CONDITIONS = [
  "Dandruff", "Frizz", "Hair loss", "Dry scalp",
  "Acne", "Dark spots", "Dullness", "Wrinkles",
  "Eczema", "Stretch marks", "Uneven tone", "Dehydration"
]
const GOALS = [
  "Deep hydration", "Shine & glow", "Hair growth",
  "Anti-aging", "Soothing & calming", "Brightening",
  "Strengthening", "Detox & purify", "Signature scent"
]

interface FormData {
  hairType: string
  skinType: string
  condition: string
  goal: string
}

interface BeautyFormProps {
  onSubmit: (data: FormData) => void
  onBack: () => void
  isLoading: boolean
  error?: string | null
}

const steps = [
  { title: "Hair Type", subtitle: "What best describes your hair?", icon: Flower2, key: "hairType" as const, options: HAIR_TYPES },
  { title: "Skin Type", subtitle: "How would you describe your skin?", icon: Droplets, key: "skinType" as const, options: SKIN_TYPES },
  { title: "Condition", subtitle: "What would you like to address?", icon: Heart, key: "condition" as const, options: CONDITIONS },
  { title: "Goal", subtitle: "What's your beauty aspiration?", icon: Target, key: "goal" as const, options: GOALS },
]

export function BeautyForm({ onSubmit, onBack, isLoading, error }: BeautyFormProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    hairType: "",
    skinType: "",
    condition: "",
    goal: "",
  })

  const currentStep = steps[step]
  const currentValue = formData[currentStep.key]

  function handleSelect(value: string) {
    setFormData(prev => ({ ...prev, [currentStep.key]: value }))
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onSubmit(formData)
    }
  }

  function handlePrev() {
    if (step > 0) {
      setStep(step - 1)
    } else {
      onBack()
    }
  }

  const Icon = currentStep.icon

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-sans transition-all duration-500 ${
                  i <= step
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-px transition-all duration-500 ${
                    i < step ? "bg-foreground" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center">
              <Icon className="w-6 h-6 text-accent" />
            </div>

            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2 text-balance">
                {currentStep.title}
              </h2>
              <p className="text-muted-foreground font-sans">
                {currentStep.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
              {currentStep.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option)}
                  className={`px-5 py-4 rounded-xl text-sm font-sans transition-all duration-300 border ${
                    currentValue === option
                      ? "bg-foreground text-background border-foreground shadow-lg"
                      : "bg-card text-foreground border-border hover:border-accent/50 hover:bg-card/80"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-sm text-destructive text-center font-sans"
          >
            {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!currentValue || isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full text-sm font-sans uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Crafting...
              </>
            ) : step === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Create Recipe
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
